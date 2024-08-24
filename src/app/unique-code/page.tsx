import { useState, useEffect, useCallback } from "react";
import emailjs from "emailjs-com";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import "../../globals.css";

export default function UniqueCodePage() {
  const [uniqueCode, setUniqueCode] = useState(() => {
    const savedCode = localStorage.getItem("uniqueCode");
    return savedCode || "";
  });

  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!uniqueCode) {
      generateUniqueCode();
    }
  }, [uniqueCode]);

  const generateUniqueCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let result = "";
    for (let i = 0; i < 3; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 2; i++) {
      result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    setUniqueCode(result);
    localStorage.setItem("uniqueCode", result);
  };

  const downloadCode = useCallback(() => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("Code", 105, 120, { align: "center" });
    doc.setFontSize(80);
    doc.text(uniqueCode, 105, 160, { align: "center" });
    doc.save("eloheh_unique_code.pdf");
  }, [uniqueCode]);

  useEffect(() => {
    if (uniqueCode) {
      downloadCode();
    }
  }, [uniqueCode, downloadCode]);

  const sendEmail = () => {
    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        { to_email: email, code: uniqueCode },
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID
      )
      .then(
        (response) => {
          console.log(response);
          alert("Email sent successfully!");
        },
        (error) => {
          console.log(error);
          alert("Failed to send email. Please try again.");
        }
      );
  };

  return (
    <div className="container">
      <h1>Code</h1>
      <p className="code">{uniqueCode}</p>
      <div>
        <FaDownload onClick={downloadCode} className="download-icon" />
      </div>
      <div className="form-container">
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="email-input"
        />
        <button onClick={sendEmail} className="send-button">
          Send Code to Email
        </button>
      </div>
    </div>
  );
}
