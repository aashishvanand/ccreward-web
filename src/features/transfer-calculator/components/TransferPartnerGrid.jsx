"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tabs,
  Tab,
  useTheme,
  tooltipClasses,
  Tooltip,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Flight as FlightIcon,
  Hotel as HotelIcon,
} from "@mui/icons-material";
import Image from "next/image";
import { useRegion } from "@/core/providers/RegionContext";
import { usePartnerLogos } from "@/core/hooks";
import airlineInData from "@/data/transfer_airline_in.json";
import airlineSgData from "@/data/transfer_airline_sg.json";
import hotelInData from "@/data/transfer_hotel_in.json";
import hotelSgData from "@/data/transfer_hotel_sg.json";
import banksInData from "@/data/banks_in.json";
import banksSgData from "@/data/banks_sg.json";
import { styled } from "@mui/material/styles";
import { buildCloudflareImageUrl } from "@/core/utils/cloudflareImages";

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: "pointer",
  backgroundColor: theme.palette.background.paper, // Ensure solid base
  transition: theme.transitions.create("background-image", {
    duration: theme.transitions.duration.shortest,
  }),
  "&:nth-of-type(odd)": {
    backgroundImage: `linear-gradient(${theme.palette.action.hover}, ${theme.palette.action.hover})`,
  },
  "&:hover": {
    backgroundColor: theme.palette.background.paper, // Keep base solid
    backgroundImage: `linear-gradient(${
      theme.palette.action.selected || theme.palette.action.hover
    }, ${theme.palette.action.selected || theme.palette.action.hover})`,
  },
  // Hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));


const TransferPartnerGrid = () => {
  const { region } = useRegion();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const { logos } = usePartnerLogos();

  const data = useMemo(() => {
    const isSg = region === "SG";
    return {
      airline: isSg ? airlineSgData : airlineInData,
      hotel: isSg ? hotelSgData : hotelInData,
    };
  }, [region]);

  const processData = (sourceData) => {
    const banksSet = new Set();
    const partners = [];

    Object.entries(sourceData).forEach(([partnerName, transferInfo]) => {
      const bankDetails = {};
      
      const processEntry = (entry) => {
        if (entry.bank) {
          banksSet.add(entry.bank);
          bankDetails[entry.bank] = {
             currency: entry.currency
          };
        }
      };

      if (Array.isArray(transferInfo)) {
        transferInfo.forEach(processEntry);
      } else {
        processEntry(transferInfo);
      }

      partners.push({
        name: partnerName,
        bankDetails: bankDetails,
      });
    });

    return {
      banks: Array.from(banksSet).sort(),
      partners: partners.sort((a, b) => a.name.localeCompare(b.name)),
    };
  };

  const currentData = useMemo(() => {
    const source = tabValue === 0 ? data.airline : data.hotel;
    return processData(source);
  }, [data, tabValue]);

  const getPartnerLogo = (partnerName, type) => {
    if (type === "airline") {
        // Try to find by name if exact match fails (though APIs usually map by Code/IATA, local JSON keys are names)
        // The existing hook uses IATA codes for airlines, but our JSON keys are Names.
        // We might need a name->IATA mapping or check if the keys are already usable. 
        // A simple fallback:
         const airlineKey = Object.keys(logos.airline).find((key) =>
             // This is a rough heuristic since we don't have the IATA code here easily available without looking it up
             // detailed mapping might be needed. For now, let's try direct lookup if key matches
              key === partnerName // Unlikely to match IATA
            );
         // Actually, let's rely on the text name if logo is missing, or try to be smart.
         // Wait, the previos component `TransferCalculator` had `partner.iata`. 
         // But here we are reading raw JSON where keys are names. 
         // Let's iterate logos.airline values to see if we can match? No, that's URLs.
         // Let's Just use the icon fallback for now unless we can map it.
         return null; 
    } else {
        // Hotels logic from previous component
         const hotelKey = Object.keys(logos.hotel).find((key) =>
            partnerName.toLowerCase().includes(key)
         );
         if (hotelKey) return logos.hotel[hotelKey];
    }
    return null;
  };
  
    // Helper to try and persist logos from the TransferCalculator logic if possible.
    // Since we don't have IATA codes in the keys of transfer_airline_in.json (keys are names like "AAdvantage"), 
    // and usePartnerLogos expects IATA.
    // For now we will display the name and a default icon, or partial match if possible.
    // We can iterate the Logos object? No, we don't want to overengineer this right now.


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Transfer Partners Matrix
      </Typography>
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab icon={<FlightIcon />} label="Airlines" iconPosition="start" />
          <Tab icon={<HotelIcon />} label="Hotels" iconPosition="start" />
        </Tabs>

        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "background.paper",
                    zIndex: 3, // Higher than other headers
                    position: "sticky",
                    left: 0,
                    minWidth: 150,
                    borderRight: "1px solid " + theme.palette.divider,
                  }}
                >
                  Partner / Bank
                </TableCell>
                {currentData.banks.map((bankName) => {
                  // Lookup bank logo
                  const currentBankData = region === 'SG' ? banksSgData : banksInData;
                  const bankInfo = currentBankData.find(b => b.bank.toLowerCase() === bankName.toLowerCase());
                  
                  return (
                  <TableCell
                    key={bankName}
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "background.paper",
                      minWidth: 80,
                      p: 1
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        {bankInfo ? (
                             <Box sx={{ position: 'relative', width: 40, height: 40 }}>
                                 <Image 
                                    src={buildCloudflareImageUrl(bankInfo.id, "public")} 
                                    alt={bankName}
                                    fill
                                    unoptimized
                                    style={{ objectFit: 'contain' }}
                                />
                             </Box>
                        ) : null}
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                            {bankName}
                        </Typography>
                    </Box>
                  </TableCell>
                )})}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.partners.map((partner) => {
                 // Try to resolve logo
                 const type = tabValue === 0 ? 'airline' : 'hotel';
                 let logoSrc = null;
                 
                 
                 if (type === 'airline') {
                    // Extract IATA from "(IATA) - Name" format if present
                    const iataMatch = partner.name.match(/^\(([A-Z0-9]+)\)\s*-\s*/);
                    const iata = iataMatch ? iataMatch[1] : partner.name; // Fallback to full name if no match
                    
                    if (logos.airline[iata]) {
                        logoSrc = logos.airline[iata];
                    }
                 } else if(type === 'hotel') {
                     const k = Object.keys(logos.hotel).find(key => partner.name.toLowerCase().includes(key));
                     if(k) logoSrc = logos.hotel[k];
                 }
                
                return (
                  <StyledTableRow key={partner.name}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        position: "sticky",
                        left: 0,
                        background: "inherit",
                        borderRight: "1px solid " + theme.palette.divider,
                        zIndex: 1,
                        fontWeight: 500,
                        p: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {logoSrc ? (
                              <Image src={buildCloudflareImageUrl(logoSrc, "public")} alt={partner.name} width={24} height={24} unoptimized style={{objectFit: 'contain'}} />
                          ) : (
                               type === "airline" ? <FlightIcon fontSize="small" color="action"/> : <HotelIcon fontSize="small"  color="action"/>
                          )}
                        <Typography variant="body2" noWrap title={partner.name}>
                          {partner.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    {currentData.banks.map((bank) => {
                      const details = partner.bankDetails[bank];
                      return (
                        <TableCell key={bank} align="center">
                          {details ? (
                            <StyledTooltip title={Array.isArray(details.currency) ? details.currency.join(", ") : details.currency} arrow>
                               <CheckCircleIcon color="success" fontSize="small" sx={{ cursor: 'help' }} />
                            </StyledTooltip>
                          ) : (
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.disabled"
                              }}
                            >
                              -
                            </Typography>
                          )}
                        </TableCell>
                      );
                    })}
                  </StyledTableRow>
                );})}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TransferPartnerGrid;
