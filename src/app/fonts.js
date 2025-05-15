import { Poppins, Montserrat } from 'next/font/google';

// Configure Poppins font
export const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600'],
  variable: '--font-poppins',
});

// Configure Montserrat font
export const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700'],
  variable: '--font-montserrat',
});
