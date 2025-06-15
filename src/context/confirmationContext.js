import React, { createContext, useContext } from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";
import toast from "react-hot-toast";

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
