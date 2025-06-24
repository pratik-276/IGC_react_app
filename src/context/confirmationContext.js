import React, { createContext, useContext } from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";
import toast from "react-hot-toast";
import GameTracker from "../services/GameTracker";

const ContactSalesContext = createContext();

const ContactSalesProvider = ({ children }) => {
  const showContactSalesConfirmation = () => {
    confirmDialog({
      message: "Would you like our sales team to contact you?",
      header: "Contact Sales",
      icon: "pi pi-question-circle",
      acceptLabel: "Yes",
      rejectLabel: "No",
      accept: () => {
        toast.success("User accepted to be contacted.");
        console.log("User accepted to be contacted.");
        const user_email = localStorage.getItem('user_email');
        GameTracker.mail_sales_team({"user_email": user_email});
      },
      reject: () => {
        toast.error("User declined to be contacted.");
        console.log("User declined to be contacted.");
      },
    });
  };

  return (
    <ContactSalesContext.Provider value={{ showContactSalesConfirmation }}>
      <ConfirmDialog />
      {children}
    </ContactSalesContext.Provider>
  );
};

export const useContactSales = () => useContext(ContactSalesContext);

export default ContactSalesProvider;
