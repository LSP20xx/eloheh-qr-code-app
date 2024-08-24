import QRCode from "react-qr-code";

export default function Home() {
  const url = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/unique-code`
    : "http://localhost:3000/unique-code";

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>QR Code</h1>
      <QRCode value={url} size={256} />
      <p>Scan the QR code to get a unique code.</p>
    </div>
  );
}
