import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Category,
  AttachMoney,
  People,
  MoreVert,
} from '@mui/icons-material';

// Données de démonstration
const salesData = [
  { month: 'Jan', ventes: 4000, commandes: 240 },
  { month: 'Fév', ventes: 3000, commandes: 139 },
  { month: 'Mar', ventes: 2000, commandes: 980 },
  { month: 'Avr', ventes: 2780, commandes: 390 },
  { month: 'Mai', ventes: 1890, commandes: 480 },
  { month: 'Juin', ventes: 2390, commandes: 380 },
  { month: 'Juil', ventes: 3490, commandes: 430 },
];

const productPerformance = [
  { name: 'T-shirt Noir', ventes: 234, revenu: 4500, stock: 45 },
  { name: 'Sweat à capuche', ventes: 189, revenu: 3200, stock: 32 },
  { name: 'Chaussures Sport', ventes: 156, revenu: 2800, stock: 12 },
  { name: 'Casquette', ventes: 98, revenu: 1200, stock: 67 },
  { name: 'Sac à dos', ventes: 76, revenu: 1800, stock: 24 },
];

// Composant de carte de statistique
const StatCard = ({ title, value, change, icon, color }) => (
  <Card sx={{ height: '100%', borderRadius: 3 }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="overline">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
          <Box display="flex" alignItems="center" mt={1}>
            {change >= 0 ? (
              <TrendingUp fontSize="small" sx={{ color: '#4caf50', mr: 0.5 }} />
            ) : (
              <TrendingDown fontSize="small" sx={{ color: '#f44336', mr: 0.5 }} />
            )}
            <Typography
              variant="body2"
              sx={{ color: change >= 0 ? '#4caf50' : '#f44336' }}
            >
              {change >= 0 ? '+' : ''}{change}%
            </Typography>
            <Typography variant="body2" color="textSecondary" ml={1}>
              vs mois dernier
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            bgcolor: `${color}20`,
            borderRadius: '50%',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {React.cloneElement(icon, { sx: { color, fontSize: 28 } })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export const Statistics = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        📊 Tableau de bord - Statistiques
      </Typography>

      {/* Cartes de statistiques principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenu total"
            value="12.5K€"
            change={12.5}
            icon={<AttachMoney />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Commandes"
            value="1,243"
            change={8.2}
            icon={<ShoppingCart />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Produits"
            value="156"
            change={5.7}
            icon={<Category />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Clients"
            value="4,892"
            change={15.3}
            icon={<People />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      {/* Graphiques simples avec des divs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Évolution des ventes mensuelles
            </Typography>
            <Box sx={{ height: 250, display: 'flex', alignItems: 'flex-end', gap: 1, mt: 3, px: 2 }}>
              {salesData.map((item, index) => (
                <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: '70%',
                      height: `${(item.ventes / 5000) * 180}px`,
                      bgcolor: index % 2 === 0 ? 'primary.main' : 'primary.light',
                      borderRadius: '4px 4px 0 0',
                      mb: 1,
                      transition: 'height 0.3s',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      }
                    }}
                  />
                  <Typography variant="caption" fontWeight="medium">
                    {item.month}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {item.ventes.toLocaleString()}€
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, bgcolor: 'primary.main', borderRadius: 2 }} />
                <Typography variant="body2">Ventes (€)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, bgcolor: 'primary.light', borderRadius: 2 }} />
                <Typography variant="body2">Commandes</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Vue d'ensemble
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" gutterBottom>
                Taux de conversion global: <strong>12.5%</strong>
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={12.5} 
                sx={{ height: 10, borderRadius: 5, mb: 3 }}
              />
              
              <Typography variant="body2" gutterBottom>
                Satisfaction client: <strong>94%</strong>
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={94} 
                sx={{ height: 10, borderRadius: 5, mb: 3 }}
                color="success"
              />
              
              <Typography variant="body2" gutterBottom>
                Taux de retour: <strong>3.2%</strong>
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={3.2} 
                sx={{ height: 10, borderRadius: 5 }}
                color="warning"
              />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Tableau des produits performants */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Produits les plus performants</Typography>
            <Chip label="30 derniers jours" color="primary" />
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Produit</TableCell>
                  <TableCell align="right">Ventes</TableCell>
                  <TableCell align="right">Revenu</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell align="right">Taux de conversion</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productPerformance.map((product, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography fontWeight="medium">{product.name}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" alignItems="center" justifyContent="flex-end">
                        {product.ventes}
                        {product.ventes > 200 && (
                          <TrendingUp fontSize="small" sx={{ color: '#4caf50', ml: 1 }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" alignItems="center" justifyContent="flex-end">
                        <AttachMoney fontSize="small" sx={{ mr: 0.5, color: 'green' }} />
                        {product.revenu}€
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" alignItems="center" justifyContent="flex-end">
                        <LinearProgress
                          variant="determinate"
                          value={(product.stock / 100) * 100}
                          sx={{
                            width: 60,
                            mr: 2,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: product.stock < 20 ? '#ffcdd2' : '#c8e6c9',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: product.stock < 20 ? '#f44336' : '#4caf50',
                            },
                          }}
                        />
                        {product.stock}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${Math.round((product.ventes / 500) * 100)}%`}
                        color={Math.round((product.ventes / 500) * 100) > 30 ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small">
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};