import React from 'react';
import { ImageList, ImageListItem, Box, Typography, Button, Stack, Paper } from '@mui/material';
import Image from 'next/image';

const TopCardsGrid = ({ cards, isMobile, isTablet, handleCardClick, theme }) => {
  const cols = isMobile ? 2 : isTablet ? 3 : 4;

  return (
    <ImageList 
      variant="masonry" 
      cols={cols}
      gap={16}
      sx={{
        width: '100%',
        margin: 0,
        '& .MuiImageListItem-root': {
          display: 'block',
          overflow: 'hidden',
          borderRadius: 1,
          bgcolor: 'background.paper',
          boxShadow: 1,
          mb: 2,
          cursor: isMobile ? 'default' : 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4
          }
        }
      }}
    >
      {cards.map((card) => (
        <ImageListItem 
          key={`${card.bank}-${card.cardName}`}
          onClick={() => !isMobile && handleCardClick(card.bank, card.cardName)}
          sx={{ width: '100%' }}
        >
          <Paper elevation={0} sx={{ overflow: 'hidden' }}>
            <Box sx={{ 
              position: 'relative',
              width: '100%',
              aspectRatio: card.orientation === 'vertical' ? '0.63/1' : '1.59/1',
              marginBottom: 0
            }}>
              {card.image && (
                <Image
                  src={card.image}
                  alt={`${card.bank} ${card.cardName}`}
                  layout="fill"
                  objectFit="contain"
                  priority={true}
                />
              )}
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderTop: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper'
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography 
                    variant="subtitle2"
                    sx={{ 
                      fontSize: card.orientation === 'vertical' ? '0.75rem' : '0.875rem',
                      fontWeight: 600,
                      lineHeight: 1.2
                    }}
                    noWrap
                  >
                    {card.cardName}
                  </Typography>
                  <Typography 
                    variant="caption"
                    color="text.secondary"
                    sx={{ 
                      fontSize: card.orientation === 'vertical' ? '0.7rem' : '0.75rem',
                      lineHeight: 1.2,
                      display: 'block'
                    }}
                    noWrap
                  >
                    {card.bank}
                  </Typography>
                </Box>
                {!isMobile && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(card.bank, card.cardName);
                    }}
                    sx={{ 
                      minWidth: 0,
                      px: 2,
                      py: 0.75,
                      fontSize: card.orientation === 'vertical' ? '0.7rem' : '0.75rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Calculate Rewards
                  </Button>
                )}
              </Stack>
            </Box>
          </Paper>
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default TopCardsGrid;