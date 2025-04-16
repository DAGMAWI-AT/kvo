import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FiDownload,
  FiExternalLink,
  FiArrowLeft,
  FiPrinter,
  FiFile,

} from "react-icons/fi";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Barcode from "react-barcode";
import {
  FaUserAlt,
  FaShieldAlt,
  FaIdBadge,
  FaMobileAlt,
  FaBirthdayCake,
  FaInfoCircle,
} from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import { IoMdLocate, IoMdPerson } from "react-icons/io";
import { BarLoader } from "react-spinners";

const ViewBeneficiary = () => {
  const { id } = useParams();
  const [beneficiary, setBeneficiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState({});
  // const [photoDataUrl, setPhotoDataUrl] = useState("");

  useEffect(() => {
    const fetchBeneficiary = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/beneficiaries/${id}`
        );
        setBeneficiary(response.data.data);
      
      } catch (error) {
        toast.error(error.message || "Error!");
      } finally {
        setLoading(false);
      }
    };
    fetchBeneficiary();
  }, [id]);

  const isPDF = (url) => url?.toLowerCase().endsWith(".pdf");
  const isImage = (url) => /\.(jpeg|jpg|gif|png)$/i.test(url);

  const FilePreview = ({ url }) => {
    if (!url) return null;
    return (
      <div className="mt-4 border rounded-lg overflow-hidden">
        <div className="bg-gray-100 p-4 min-h-[300px] flex items-center justify-center">
          {isPDF(url) ? (
            <embed
              src={url}
              type="application/pdf"
              className="w-full h-96"
              title="ID Document PDF"
            />
          ) : isImage(url) ? (
            <img
              src={url}
              alt="ID Document"
              className="max-w-full max-h-96 object-contain"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="text-gray-500">Unsupported file format</div>
          )}
        </div>
        <div className="bg-gray-50 p-3 border-t flex justify-end gap-3">
          <a
            href={url}
            download
            className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
          >
            <FiDownload className="w-5 h-5" />
            <span>Download</span>
          </a>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiExternalLink className="w-5 h-5" />
            <span>Open</span>
          </a>
        </div>
      </div>
    );
  };

  const handlePrint = async () => {
    if (!beneficiary) return;

    try {
      const printWindow = window.open("", "_blank");
      const content = document.getElementById("id-card-template").innerHTML;

      printWindow.document.write(`
        <html>
          <head>
            <title>Print ID Card</title>
            <style>
              @media print {
                @page {
                  size: 85.6mm 53.98mm;
                  margin: 0;
                }
                body {
                  margin: 0;
                  padding: 0;
                  -webkit-print-color-adjust: exact;
                }
              }
              .print-card {
                width: 85.6mm;
                height: 53.98mm;
                background: linear-gradient(135deg, #1a365d 0%, #153e75 100%);
                border-radius: 8px;
                position: relative;
                color: white;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border: 1px solid rgba(255,255,255,0.1);
              }
              .card-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23153e75' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
                opacity: 0.3;
              }
              .header {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                text-align: center;
                font-size: 10px;
                font-weight: bold;
                padding: 6px 0;
                background: rgba(0,0,0,0.2);
                letter-spacing: 1px;
                text-transform: uppercase;
                border-bottom: 1px solid rgba(255,255,255,0.1);
              }
              .photo-container {
                width: 25mm;
                height: 30mm;
                background: white;
                border-radius: 4px;
                overflow: hidden;
                border: 2px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                position: relative;
              }
              .photo-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0,0,0,0.5);
                color: white;
                font-size: 6px;
                padding: 2px;
                text-align: center;
              }
              .details {
                font-size: 8px;
                line-height: 1.4;
              }
              .detail-row {
                display: flex;
                margin-bottom: 2px;
              }
              .detail-label {
                font-weight: bold;
                width: 25mm;
                color: #d1d5db;
              }
              .detail-value {
                flex: 1;
              }
              .qr-code {
                position: absolute;
                bottom: 1px;
                right: 1px;
                background: white;
                padding: 0.1px;
                border-radius: 4px;
                width: 14mm;
                height: 14mm;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .barcode {
                position: absolute;
                bottom: 28px;
                right: 8px;
                background: white;
                padding: 2px;
                border-radius: 4px;
                width: 40mm;
              }
              .watermark {
                position: absolute;
                bottom: 4px;
                left: 8px;
                font-size: 6px;
                opacity: 0.7;
              }
              .security-strip {
                position: absolute;
                top: 24px;
                left: 0;
                right: 0;
                height: 8px;
                background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,215,0,0.5) 50%, rgba(255,255,255,0) 100%);
              }
              .id-number {
                position: absolute;
                top: 36px;
                left: 8px;
                font-size: 10px;
                font-weight: bold;
                letter-spacing: 1px;
                color: #fcd34d;
              }
              .valid-thru {
                position: absolute;
                top: 50px;
                left: 8px;
                font-size: 6px;
                color: #d1d5db;
              }
              .valid-date {
                font-size: 8px;
                color: white;
                font-weight: bold;
              }
              .signature {
                position: absolute;
                bottom: 28px;
                left: 8px;
                font-size: 6px;
                color: #d1d5db;
                border-top: 1px solid rgba(255,255,255,0.3);
                padding-top: 2px;
                width: 30mm;
              }
              .hologram {
                position: absolute;
                top: 40px;
                right: 8px;
                width: 12mm;
                height: 12mm;
                border-radius: 50%;
                background: linear-gradient(45deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 8px rgba(255,255,255,0.5);
              }
              .hologram-inner {
                width: 8mm;
                height: 8mm;
                border-radius: 50%;
                background: linear-gradient(45deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 6px;
                color: rgba(0,0,0,0.5);
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="print-card">
              <div class="card-overlay"></div>
              <div class="header">BENEFICIARY IDENTIFICATION CARD</div>
              <div class="security-strip"></div>
              
              <div class="id-number">ID: ${beneficiary.beneficiary_id}</div>
              <div class="valid-thru">VALID THRU <span class="valid-date">${new Date().toLocaleDateString()}</span></div>
              
              <div style="display: flex; height: 100%; padding-top: 20px">
                <div style="width: 30mm; text-align: center; padding: 0 4px; position: relative;">
                  <div class="photo-container">
                    <img src="${process.env.REACT_APP_API_URL}/beneficiary/${beneficiary.photo}" 
                         style="width: 100%; height: 100%; object-fit: cover" 
                         crossOrigin="anonymous"/>
                    <div class="photo-overlay">OFFICIAL PHOTO</div>
                  </div>
                </div>
                
                <div style="width: 50mm; padding: 8px 4px 4px 8px;" class="details">
                  <div style="font-weight: bold; font-size: 10px; margin-bottom: 6px; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px;">
                    ${beneficiary.fullName}
                  </div>
                  
                  <div class="detail-row">
                    <div class="detail-label">Location:</div>
                    <div class="detail-value">${beneficiary.location}</div>
                  </div>
                  <div class="detail-row">
                    <div class="detail-label">Kebele:</div>
                    <div class="detail-value">${beneficiary.kebele}</div>
                  </div>
                  <div class="detail-row">
                    <div class="detail-label">House No:</div>
                    <div class="detail-value">${beneficiary.houseNo}</div>
                  </div>
                  <div class="detail-row">
                    <div class="detail-label">Gender:</div>
                    <div class="detail-value">${beneficiary.gender}</div>
                  </div>
                  <div class="detail-row">
                    <div class="detail-label">Age:</div>
                    <div class="detail-value">${beneficiary.age}</div>
                  </div>
                </div>
              </div>
              
              <div class="hologram">
                <div class="hologram-inner">SECURITY</div>
              </div>
              
              <div class="barcode">
                ${document.getElementById("barcode-container").innerHTML}
              </div>
              
              <div class="qr-code">
                ${document.getElementById("qr-code-container").innerHTML}
              </div>
              
              <div class="signature">Authorized Signature</div>
              
              <div class="watermark">Issued by ${
                beneficiary.kfleketema
              } Administration • ${new Date().getFullYear()}</div>
            </div>
            <script>
              window.onload = () => {
                window.print();
                window.onafterprint = () => window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();

      // Generate PDF
      const tempDiv = document.createElement("div");
      tempDiv.style.width = "90.6mm";
      tempDiv.style.height = "56.98mm";
      tempDiv.innerHTML = document.getElementById("id-card-template").innerHTML;
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });

      document.body.removeChild(tempDiv);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [90.6, 56.98],
      });

      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 90.6, 56.98);
      pdf.save(`${beneficiary.fullName.replace(/\s+/g, "_")}_ID_Card.pdf`);

      toast.success("ID card generated successfully!");
    } catch (error) {
      toast.error("Failed to generate ID card: " + error.message);
      console.error("Print Error:", error);
    }
  };
  const generateQRCodeValue = () => {
    if (!beneficiary) return "";

    const data = {
      id: beneficiary.beneficiary_id,
      name: beneficiary.fullName,
      location: beneficiary.location,
      kebele: beneficiary.kebele,
      // using the blob URL instead of a huge base64 string
      photoUrl:`${process.env.REACT_APP_API_URL}/beneficiary/${beneficiary.photo}`,
      // photoUrl: photoDataUrl,
      timestamp: new Date().toISOString(),
    };

    return JSON.stringify(data);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-transparent">
        <BarLoader color="#4F46E5" size={50} />
      </div>
    );
  }

  if (!beneficiary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">Beneficiary not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/admin/beneficiary_list"
          className="flex items-center text-blue-800 hover:text-blue-600 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          <span className="font-medium">Back to Beneficiaries</span>
        </Link>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <FiPrinter className="w-5 h-5" />
          Generate ID Card
        </button>
      </div>

      {/* ID Card Preview Section */}
      <div className="mb-12 flex justify-center">
        <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl shadow-2xl relative p-6 transform hover:scale-105 transition-transform">
          {/* ID Card Template */}
          <div id="id-card-template" >
            <div className="w-[85.6mm] h-[53.98mm] bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg shadow-xl relative overflow-hidden border border-gray-200">
              {/* Background pattern */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                }}
              ></div>

              {/* Header */}
              <div className="absolute top-0 left-0 right-0 text-center text-xs font-bold text-white py-1.5 bg-blue-900/50 border-b border-blue-700/50 uppercase tracking-wider">
                Beneficiary Identification Card
              </div>

              {/* Security strip */}
              <div className="absolute top-6 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"></div>

              {/* ID Number */}
              <div className="absolute top-9 left-4 text-xs font-bold text-yellow-300 tracking-wider">
                ID: {beneficiary.beneficiary_id}
              </div>

              {/* Valid thru */}
              <div className="absolute top-[52px] left-4 text-[6px] text-gray-300">
                VALID THRU{" "}
                <span className="text-[8px] font-bold text-white">
                  {new Date().getFullYear()}
                </span>
              </div>

              {/* Main content */}
              <div className="flex h-full pt-[22px]">
                {/* Photo section */}
                <div className="w-[30mm] flex flex-col items-center pt-2 relative">
                  <div className="w-[25mm] h-[30mm] bg-white rounded-sm overflow-hidden border-2 border-white shadow-md relative">
                    {!imgError[beneficiary.id] && beneficiary.photo ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/beneficiary/${beneficiary.photo}`}
                        alt={beneficiary.fullName}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <FaUserAlt className="text-gray-400 text-2xl" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[6px] py-0.5 text-center uppercase">
                      Official Photo
                    </div>
                  </div>
                </div>

                {/* Details section */}
                <div className="flex-1 pt-2 px-3 text-white">
                  <h2 className="text-[10px] font-bold uppercase mb-1.5 pb-1 border-b border-blue-700/50 tracking-wide">
                    {beneficiary.fullName}
                  </h2>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[7px]">
                    <div className="flex">
                      <div className="w-[20mm] text-gray-300 font-medium">
                        Location:
                      </div>
                      <div className="flex-1 font-semibold">
                        {beneficiary.location}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-[20mm] text-gray-300 font-medium">
                        Kebele:
                      </div>
                      <div className="flex-1 font-semibold">
                        {beneficiary.kebele}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-[20mm] text-gray-300 font-medium">
                        House No:
                      </div>
                      <div className="flex-1 font-semibold">
                        {beneficiary.houseNo}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-[20mm] text-gray-300 font-medium">
                        Gender:
                      </div>
                      <div className="flex-1 font-semibold">
                        {beneficiary.gender}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-[20mm] text-gray-300 font-medium">
                        Age:
                      </div>
                      <div className="flex-1 font-semibold">
                        {beneficiary.age}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-[20mm] text-gray-300 font-medium">
                        Wereda:
                      </div>
                      <div className="flex-1 font-semibold">
                        {beneficiary.wereda}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hologram */}
              <div className="absolute top-[38px] right-3 w-[12mm] h-[12mm] rounded-full bg-gradient-to-br from-white/80 to-white/20 shadow-[0_0_8px_rgba(255,255,255,0.5)] flex items-center justify-center">
                <div className="w-[8mm] h-[8mm] rounded-full bg-gradient-to-br from-black/20 to-black/5 flex items-center justify-center text-[6px] font-bold text-black/50 uppercase">
                  Security
                </div>
              </div>

              {/* Barcode */}
              <div
                id="barcode-container"
                className="absolute bottom-[28px] right-3 bg-white p-0.5 rounded-sm"
              >
                <Barcode
                  value={beneficiary.beneficiary_id}
                  width={1}
                  height={20}
                  fontSize={8}
                  background="white"
                />
              </div>

              {/* QR Code */}
              <div
                id="qr-code-container"
                className="absolute bottom-2 right-3 bg-white p-0.5 rounded-sm"
              >
                {/* <QRCodeSVG 
                  value={`${process.env.REACT_APP_API_URL}/beneficiary/${beneficiary.photo}|${beneficiary.beneficiary_id}|${beneficiary.fullName}|${beneficiary.kebele}`}
                  size={40}
                  level="H"
                  includeMargin={false}
                /> */}
                  <QRCodeSVG
                    value={generateQRCodeValue()}
                    size={40}
                    level="H"
                    includeMargin={true}
                    imageSettings={{
                      src: `${process.env.REACT_APP_API_URL}/beneficiary/${beneficiary.photo}`, // Your blob URL used for embedding in the QR code
                      height: 10,
                      width: 10,
                      excavate: true,
                    }}
                  />

              </div>

              {/* Signature */}
              <div className="absolute bottom-[28px] left-3 text-[6px] text-gray-300 border-t border-blue-700/50 pt-0.5 w-[30mm]">
                Authorized Signature
              </div>

              {/* Watermark */}
              <div className="absolute bottom-1 left-3 text-[5px] text-gray-400">
                Issued by {beneficiary.kfleketema} Administration •{" "}
                {new Date().toUTCString()}
              </div>
            </div>
          </div>

          {/* Visible Preview */}
          {/* <div className="mb-8 flex justify-center">
            <div
              className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg shadow-xl relative overflow-hidden border border-gray-200"
              style={{
                width: "85.6mm",
                height: "53.98mm",
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    document.getElementById("id-card-template")?.innerHTML,
                }}
              />
            </div>
          </div> */}
        </div>
      </div>
      <div className="mt-8 p-4 bg-gray-50 rounded-lg hidden">
        <h4 className="font-medium text-gray-700 mb-2">QR Code Contents:</h4>
        <pre className="text-xs text-gray-600 overflow-x-auto">
          {generateQRCodeValue()}
        </pre>
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Personal Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <img
                  src={`${process.env.REACT_APP_API_URL}/beneficiary/${beneficiary.photo}`}
                  alt={beneficiary.fullName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={() =>
                    setImgError({ ...imgError, [beneficiary.id]: true })
                  }
                />
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-md">
                  <FaShieldAlt className="text-sm" />
                </div>
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-800">
                {beneficiary.fullName}
              </h2>
              <p className="text-gray-600 text-sm">{beneficiary.email}</p>
              <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                ID: {beneficiary.beneficiary_id}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center">
                <FaUserAlt className="mr-2 text-blue-600" />
                Personal Information
              </h3>
              <DetailItem
                label="Beneficiary ID"
                value={beneficiary.beneficiary_id}
                icon={<FaIdBadge className="w-4 h-4 mr-2" />}
              />
              <DetailItem
                label="Phone Number"
                value={beneficiary.phone}
                icon="phone"
              />
              <DetailItem
                label="Gender"
                value={beneficiary.gender}
                icon="gender"
              />
              <DetailItem
                label="Age"
                value={beneficiary.age}
                icon="birthday-cake"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Address & Documents */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center">
                  <IoMdLocate className="w-5 h-5 mr-2 text-blue-600" />
                  Location Details
                </h3>
                <DetailItem label="Kebele" value={beneficiary.kebele} />
                <DetailItem label="House No" value={beneficiary.houseNo} />
                <DetailItem label="Wereda" value={beneficiary.wereda} />
                <DetailItem label="Kfleketema" value={beneficiary.kfleketema} />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center">
                  <FaInfoCircle className="w-5 h-5 mr-2 text-blue-600" />
                  Institution Information
                </h3>
                <DetailItem label="Location" value={beneficiary.location} />
                <DetailItem label="School" value={beneficiary.school} />
                <DetailItem
                  label="Registration Date"
                  value={new Date(beneficiary.createdAt).toLocaleDateString()}
                />
              </div>
            </div>
          </div>

          {/* Documents Section */}
          {beneficiary.idFile && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center">
                <FiFile className="mr-2 text-blue-600" />
                Attached Documents
              </h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <FiFile className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 block">
                      {beneficiary.idFile}
                    </span>
                    <span className="text-xs text-gray-500">
                      Uploaded on{" "}
                      {new Date(beneficiary.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <FilePreview
                url={`${process.env.REACT_APP_API_URL}/beneficiary/${beneficiary.idFile}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced DetailItem component with icon support
const DetailItem = ({ label, value, icon }) => (
  <div className="flex justify-between items-center py-3 border-b">
    <div className="flex items-center text-gray-600 text-sm">
      {icon === "id-badge" && <FaIdBadge className="w-4 h-4 mr-2" />}
      {icon === "phone" && <FaMobileAlt className="w-4 h-4 mr-2" />}
      {icon === "gender" && <IoMdPerson className="w-4 h-4 mr-2" />}
      {icon === "birthday-cake" && <FaBirthdayCake className="w-4 h-4 mr-2" />}
      {label}
    </div>
    <span className="text-gray-800 font-medium text-sm">{value || "N/A"}</span>
  </div>
);

export default ViewBeneficiary;
