"use client";

import { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import "../globals.css";

function generateUniqueCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let result = "";
  for (let i = 0; i < 3; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < 2; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return result;
}

export default function UniqueCodePage() {
  const [uniqueCode, setUniqueCode] = useState<string>("");

  useEffect(() => {
    // Verificar si ya existe un código en localStorage
    const storedCode = localStorage.getItem("uniqueCode");
    if (storedCode) {
      setUniqueCode(storedCode);
    } else {
      // Generar un nuevo código único
      const newCode = generateUniqueCode();
      setUniqueCode(newCode);
      localStorage.setItem("uniqueCode", newCode);
    }
  }, []);

  const downloadCode = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("Code", 105, 120, { align: "center" });
    doc.setFontSize(80);
    doc.text(uniqueCode, 105, 160, { align: "center" });
    doc.save("eloheh_unique_code.pdf");
  };

  const sendEmail = async (email: string) => {
    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          subject: "Your Unique Code",
          message: `Your unique code is: ${uniqueCode}`,
        }),
      });

      if (response.ok) {
        alert("Email sent successfully!");
      } else {
        alert("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div className="container">
      <h1>Code</h1>
      {uniqueCode ? <p className="code">{uniqueCode}</p> : <p>Loading...</p>}
      <div>
        <FaDownload onClick={downloadCode} className="download-icon" />
      </div>
      <div className="form-container">
        <input
          type="email"
          placeholder="Enter email"
          className="email-input"
          onBlur={(e) => sendEmail(e.target.value)}
        />
        <button
          onClick={() => {
            const inputElement = document.querySelector(
              ".email-input"
            ) as HTMLInputElement | null;
            if (inputElement) {
              sendEmail(inputElement.value);
            } else {
              console.error("Input element not found");
            }
          }}
          className="send-button"
        >
          Send Code to Email
        </button>
      </div>
    </div>
  );
}
