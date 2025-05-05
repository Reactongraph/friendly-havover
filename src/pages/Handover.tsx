import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import HandoverPage from "@/components/handover/HandoverPage";
import { Account } from "@/types";

interface HandoverProps {
  account?: Account;
}

const Handover: React.FC<HandoverProps> = ({ account }) => {
  return (
    <Layout account={account}>
      <HandoverPage />
    </Layout>
  );
};

export default Handover;
