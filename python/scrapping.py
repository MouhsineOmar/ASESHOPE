import os
import requests
import time
import re
from urllib.parse import quote_plus
from concurrent.futures import ThreadPoolExecutor, as_completed
import random

def search_images_direct(filename, max_results=5):
    """
    Recherche des images sur plusieurs sources sans API
    """
    # Extraire les mots-clés du nom de fichier
    base_name = os.path.splitext(filename)[0]
    keywords = base_name.replace('-', ' ').replace('_', ' ')
    
    # Différentes requêtes de recherche
    search_queries = [
        f"{keywords} product photo",
        f"{keywords} clothing",
        f"{keywords} apparel",
        f"{keywords} ecommerce",
        f"{keywords} shop"
    ]
    
    all_urls = []
    
    # Essayer différentes sources
    sources = [
        ("DuckDuckGo", search_duckduckgo),
        ("Bing", search_bing_images),
        ("GoogleScrape", search_google_simple),
    ]
    
    for query in search_queries[:2]:  # Essayer 2 requêtes max
        print(f"  Recherche: '{query}'")
        
        for source_name, search_func in sources:
            try:
                urls = search_func(query, max_results=3)
                if urls:
                    all_urls.extend(urls)
                    print(f"    ✓ {source_name}: {len(urls)} résultats")
                    time.sleep(0.5)  # Pause pour éviter le rate limiting
            except Exception as e:
                print(f"    ✗ {source_name}: erreur")
                continue
        
        if len(all_urls) >= max_results:
            break
    
    return list(set(all_urls))[:max_results]  # Supprimer doublons

def search_duckduckgo(query, max_results=5):
    """
    Recherche DuckDuckGo sans API
    """
    try:
        url = f"https://html.duckduckgo.com/html/?q={quote_plus(query)}+images"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml',
            'Accept-Language': 'en-US,en;q=0.9'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        # Pattern pour trouver les images dans la page HTML
        patterns = [
            r'img_src="([^"]+\.(?:jpg|jpeg|png|gif|webp))"',
            r'src="([^"]+\.(?:jpg|jpeg|png|gif|webp))"',
            r'data-src="([^"]+\.(?:jpg|jpeg|png|gif|webp))"'
        ]
        
        urls = []
        for pattern in patterns:
            matches = re.findall(pattern, response.text, re.IGNORECASE)
            for match in matches:
                if match.startswith('//'):
                    match = 'https:' + match
                if match.startswith('http') and match not in urls:
                    urls.append(match)
                if len(urls) >= max_results:
                    break
        
        return urls[:max_results]
        
    except Exception as e:
        return []

def search_bing_images(query, max_results=5):
    """
    Recherche Bing Images sans API
    """
    try:
        url = f"https://www.bing.com/images/search?q={quote_plus(query)}&first=1"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        # Pattern pour Bing Images
        patterns = [
            r'"murl":"([^"]+\.(?:jpg|jpeg|png|gif|webp))"',
            r'src="([^"]+\.bing\.net[^"]+\.(?:jpg|jpeg|png|gif|webp))"'
        ]
        
        urls = []
        for pattern in patterns:
            matches = re.findall(pattern, response.text)
            for match in matches:
                img_url = match.replace('\\', '')
                if img_url.startswith('//'):
                    img_url = 'https:' + img_url
                if img_url.startswith('http') and img_url not in urls:
                    urls.append(img_url)
                if len(urls) >= max_results:
                    break
        
        return urls[:max_results]
        
    except Exception as e:
        return []

def search_google_simple(query, max_results=5):
    """
    Recherche Google Images simplifiée (attention: peut être bloquée)
    """
    try:
        url = f"https://www.google.com/search?q={quote_plus(query)}&tbm=isch"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        # Pattern pour Google Images
        pattern = r'"ou":"([^"]+\.(?:jpg|jpeg|png|gif|webp))"'
        matches = re.findall(pattern, response.text)
        
        urls = []
        for match in matches[:max_results]:
            if match.startswith('http') and match not in urls:
                urls.append(match)
        
        return urls[:max_results]
        
    except Exception as e:
        return []

def download_image_from_url(url, filename, folder="scrap-product"):
    """
    Télécharge une image à partir d'une URL
    """
    try:
        os.makedirs(folder, exist_ok=True)
        
        filepath = os.path.join(folder, filename)
        
        # Vérifier si le fichier existe déjà
        if os.path.exists(filepath):
            return True, "existant"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'image/webp,image/*,*/*;q=0.8',
            'Referer': 'https://www.google.com/'
        }
        
        response = requests.get(url, headers=headers, stream=True, timeout=15)
        
        # Vérifier si c'est une image
        content_type = response.headers.get('content-type', '')
        if 'image' not in content_type:
            return False, "pas une image"
        
        # Télécharger
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        # Vérifier la taille
        if os.path.getsize(filepath) < 1024:  # Moins de 1KB = probablement invalide
            os.remove(filepath)
            return False, "trop petit"
        
        return True, "téléchargé"
        
    except Exception as e:
        return False, str(e)[:50]

def process_single_image(filename, folder="scrap-product", max_attempts=3):
    """
    Traite le téléchargement d'une seule image
    """
    print(f"\n{'='*60}")
    print(f"Traitement: {filename}")
    
    # Essayer de trouver des URLs
    image_urls = search_images_direct(filename, max_results=5)
    
    if not image_urls:
        print(f"✗ Aucune URL trouvée pour {filename}")
        return False
    
    print(f"✓ {len(image_urls)} URLs trouvées")
    
    # Essayer de télécharger depuis chaque URL
    for attempt, url in enumerate(image_urls[:max_attempts], 1):
        print(f"  Tentative {attempt}: {url[:80]}...")
        
        success, message = download_image_from_url(url, filename, folder)
        
        if success:
            print(f"  ✓ Succès: {message}")
            return True
        else:
            print(f"  ✗ Échec: {message}")
        
        # Pause entre les tentatives
        if attempt < len(image_urls):
            time.sleep(1)
    
    print(f"✗ Échec total pour {filename}")
    return False

def download_with_fallback(filename, folder="scrap-product"):
    """
    Télécharge avec sources de secours
    """
    # Liste de sources alternatives (sites de stock photos gratuits)
    fallback_sources = {
        'tshirt': [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',  # T-shirt noir
            'https://images.unsplash.com/photo-1523381210434-271e8be1f52b'   # T-shirt
        ],
        'shorts': [
            'https://images.unsplash.com/photo-1591195853828-11db59a44f6b',  # Shorts
        ],
        'sweatshirt': [
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7',  # Sweatshirt
        ],
        'hoodie': [
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7',  # Hoodie
        ],
        'jeans': [
            'https://images.unsplash.com/photo-1542272604-787c3835535d',  # Jeans
        ],
        'dress': [
            'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43',  # Robe
        ]
    }
    
    # Vérifier si on a une source de secours
    for key, urls in fallback_sources.items():
        if key in filename.lower():
            print(f"  Utilisation source de secours pour '{key}'")
            for url in urls:
                success, message = download_image_from_url(url, filename, folder)
                if success:
                    return True
    
    return False

def main():
    """
    Fonction principale
    """
    print("=== TÉLÉCHARGEUR D'IMAGES PRODUITS SANS API ===\n")
    
    # Votre liste d'images
    images_to_download = [
        "tshirt-black.jpg",
        "shorts-black.jpeg",
        "sweatshirt-black.jpg",
        "woman-black-shirt-giving-neutral-flirtatious-poses.jpg",
        "woman-holding-coffee-cup-smiling.jpg",
        "black-tshirt.jpeg",
        "sweatshirt-crewneck.jpeg",
        "shorts-denim.jpeg",
        "dress-white-leaves.jpg",
        "hoodie-purple.jpg",
        "crop-top-white.jpeg",
        "white-hoodie.jpeg",
        "tshirt-white.jpg",
        "jeans-blue.jpeg",
        "tattooed-biker-hand-hold-tshirt.jpg",
        "Onboarding-Preview.png",
        "background.png"
    ]
    
    # Dossier de destination
    output_folder = "scrap-product"
    
    print(f"Images à télécharger: {len(images_to_download)}")
    print(f"Dossier de sortie: {output_folder}")
    print("\n" + "="*60)
    
    # Télécharger en parallèle (3 à la fois maximum pour éviter le blocage)
    successful = 0
    failed = 0
    
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = []
        for filename in images_to_download:
            # Pause aléatoire pour éviter le rate limiting
            time.sleep(random.uniform(1, 3))
            future = executor.submit(process_single_image, filename, output_folder)
            futures.append((filename, future))
        
        # Collecter les résultats
        for filename, future in futures:
            try:
                result = future.result(timeout=120)  # 2 minutes timeout
                if result:
                    successful += 1
                else:
                    # Essayer les sources de secours
                    print(f"\nEssai source de secours pour {filename}...")
                    fallback_result = download_with_fallback(filename, output_folder)
                    if fallback_result:
                        successful += 1
                        print(f"✓ Source de secours réussie pour {filename}")
                    else:
                        failed += 1
                        print(f"✗ Échec même avec secours pour {filename}")
                        
            except Exception as e:
                print(f"✗ Timeout/erreur pour {filename}: {e}")
                failed += 1
    
    # Résumé
    print("\n" + "="*60)
    print("RÉSUMÉ FINAL")
    print("="*60)
    print(f"✓ Téléchargés avec succès: {successful}")
    print(f"✗ Échecs: {failed}")
    print(f"📁 Dossier: {os.path.abspath(output_folder)}")
    
    # Lister les fichiers téléchargés
    if os.path.exists(output_folder):
        files = os.listdir(output_folder)
        print(f"\nFichiers dans le dossier ({len(files)}):")
        for f in sorted(files):
            size = os.path.getsize(os.path.join(output_folder, f)) / 1024
            print(f"  • {f} ({size:.1f} KB)")

def alternative_simple_method():
    """
    Méthode alternative plus simple mais moins efficace
    Utilise des sites de stock photos directement
    """
    print("=== MÉTHODE SIMPLE (Stock Photos) ===\n")
    
    # Sites de photos gratuites avec API publique
    free_stock_sites = {
        "Pexels": "https://api.pexels.com/v1/search?query={query}&per_page=1",
        "Pixabay": "https://pixabay.com/api/?key={key}&q={query}&image_type=photo",
        "Unsplash": "https://api.unsplash.com/search/photos?query={query}&per_page=1"
    }
    
    # Pour Unsplash (sans clé API, accès public limité)
    unsplash_search = "https://source.unsplash.com/featured/600x600/?{query}"
    
    images_to_download = [
        "tshirt-black.jpg",
        "shorts-black.jpeg",
        "sweatshirt-black.jpg"
    ]
    
    output_folder = "scrap-product-simple"
    os.makedirs(output_folder, exist_ok=True)
    
    for filename in images_to_download[:3]:  # Juste 3 pour l'exemple
        query = os.path.splitext(filename)[0].replace('-', ' ')
        url = unsplash_search.format(query=quote_plus(query))
        
        print(f"Téléchargement {filename}...")
        
        try:
            response = requests.get(url, stream=True, timeout=10)
            if response.status_code == 200:
                filepath = os.path.join(output_folder, filename)
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                print(f"✓ {filename} téléchargé")
            else:
                print(f"✗ Échec pour {filename}")
        except Exception as e:
            print(f"✗ Erreur: {e}")

if __name__ == "__main__":
    # Installer les dépendances si nécessaire
    try:
        import requests
    except ImportError:
        print("Installation de requests...")
        import subprocess
        import sys
        subprocess.check_call([sys.executable, "-m", "pip", "install", "requests"])
    
    # Exécuter le script principal
    main()
    
    # Pour la méthode simple, décommentez:
    # alternative_simple_method()