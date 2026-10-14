"use client";

import BankPage from '@/features/bank/components/BankPage';

export default function BankClient({ bank, cards }) {
  return <BankPage bank={bank} cards={cards} />;
}
