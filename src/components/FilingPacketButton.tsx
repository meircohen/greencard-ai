"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { AlertCircle, Download, FileText, CheckCircle2, AlertTriangle } from "lucide-react";

interface FilingPacketButtonProps {
  caseId: string;
  caseType?: string;
}

interface FilingPacket {
  caseId: string;
  caseType: string;
  clientName: string;
  aNumber?: string;
  coverLetter: string;
  filingFee: {
    amount: number;
    payableTo: string;
    forms: Array<{ form: string; amount: number }>;
  };
  mailingAddress: {
    name: string;
    attention?: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    formatted: string;
  };
  formOrder: Array<{
    formNumber: string;
    title: string;
    status: string;
  }>;
  documentChecklist: Array<{
    name: string;
    included: boolean;
    required: boolean;
  }>;
  generatedAt: string;
  notes: string[];
}

export function FilingPacketButton({ caseId, caseType }: FilingPacketButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packet, setPacket] = useState<FilingPacket | null>(null);

  const handleGeneratePacket = async () => {
    setIsLoading(true);
    setError(null);
    setPacket(null);

    try {
      const response = await fetch(`/api/cases/${caseId}/packet`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate filing packet");
      }

      const data = await response.json();
      setPacket(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!packet) return;

    const html = generatePacketHTML(packet);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `filing-packet-${packet.caseId.substring(0, 8)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
          handleGeneratePacket();
        }}
        disabled={isLoading}
        variant="primary"
        className="gap-2"
      >
        <FileText className="h-4 w-4" />
        Generate Filing Packet
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={`Filing Packet - ${caseType || "Case"}`}>

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {error && (
            <Card className="bg-red-50 border border-red-200 p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="text-sm text-red-800">{error}</div>
              </div>
            </Card>
          )}

          {packet && (
            <div className="h-[60vh] overflow-y-auto pr-4">
              <div className="space-y-6">
                {/* Warnings */}
                {packet.notes.length > 0 && (
                  <div className="space-y-2">
                    {packet.notes.map((note, idx) => (
                      <Card key={idx} className={`p-4 flex items-start gap-3 ${note.startsWith("WARNING") ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"}`}>
                        <AlertTriangle className={`h-4 w-4 mt-0.5 ${note.startsWith("WARNING") ? "text-red-600" : "text-blue-600"}`} />
                        <div className={note.startsWith("WARNING") ? "text-red-800 text-sm" : "text-blue-800 text-sm"}>{note}</div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Client and Case Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Case Information</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Client:</span> {packet.clientName}</p>
                    {packet.aNumber && <p><span className="font-medium">A-Number:</span> {packet.aNumber}</p>}
                    <p><span className="font-medium">Case Type:</span> {packet.caseType}</p>
                    <p><span className="font-medium">Generated:</span> {new Date(packet.generatedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <h3 className="font-semibold mb-2">Cover Letter</h3>
                  <div className="bg-white border p-4 rounded text-sm whitespace-pre-wrap font-mono text-xs">
                    {packet.coverLetter}
                  </div>
                </div>

                {/* Forms */}
                <div>
                  <h3 className="font-semibold mb-2">Forms to File ({packet.formOrder.length})</h3>
                  <div className="space-y-2">
                    {packet.formOrder.map((form, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{form.formNumber}</div>
                          <div className="text-xs text-gray-600">{form.title}</div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-gray-200 rounded">
                          {form.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filing Fee */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Filing Fee Information</h3>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">Payable To:</span>
                      <span>{packet.filingFee.payableTo}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      {packet.filingFee.forms.map((f, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{f.form}</span>
                          <span>${f.amount}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold border-t pt-2 mt-2">
                        <span>Total:</span>
                        <span>${packet.filingFee.amount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mailing Address */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">USCIS Mailing Address</h3>
                  <div className="text-sm whitespace-pre-wrap font-mono">
                    {packet.mailingAddress.formatted}
                  </div>
                </div>

                {/* Document Checklist */}
                <div>
                  <h3 className="font-semibold mb-2">Document Checklist</h3>
                  <div className="space-y-1">
                    {packet.documentChecklist.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={doc.included}
                          readOnly
                          className="h-4 w-4"
                        />
                        <span className={doc.required ? "font-medium" : ""}>
                          {doc.name}
                          {doc.required && <span className="text-red-600"> (Required)</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {packet && (
            <div className="flex gap-2 justify-end mt-4 border-t pt-4">
              <Button onClick={() => setIsOpen(false)}>
                Close
              </Button>
              <Button onClick={handleDownloadPDF} className="gap-2">
                <Download className="h-4 w-4" />
                Download as HTML
              </Button>
            </div>
          )}
      </Modal>
    </>
  );
}

function generatePacketHTML(packet: FilingPacket): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Filing Packet - ${packet.caseId}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
    h1 { border-bottom: 3px solid #333; padding-bottom: 10px; }
    h2 { margin-top: 30px; color: #555; }
    .section { margin-bottom: 30px; page-break-inside: avoid; }
    .info { background: #f5f5f5; padding: 15px; border-left: 4px solid #007bff; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f5f5f5; font-weight: bold; }
    .fee-total { font-weight: bold; background: #e8f4f8; }
    .address { white-space: pre-wrap; font-family: monospace; margin: 15px 0; }
    .checklist { list-style: none; padding: 0; }
    .checklist li { padding: 8px; border-bottom: 1px solid #eee; }
    .checklist li:before { content: "\\2713 "; color: green; font-weight: bold; margin-right: 8px; }
    .warning { background: #fff3cd; padding: 15px; border-left: 4px solid #ff9800; margin-bottom: 15px; }
    .page-break { page-break-after: always; }
  </style>
</head>
<body>
  <h1>USCIS Filing Packet</h1>

  <div class="section info">
    <h3>Case Information</h3>
    <p><strong>Client:</strong> ${escapeHtml(packet.clientName)}</p>
    ${packet.aNumber ? `<p><strong>A-Number:</strong> ${escapeHtml(packet.aNumber)}</p>` : ""}
    <p><strong>Case Type:</strong> ${escapeHtml(packet.caseType)}</p>
    <p><strong>Generated:</strong> ${new Date(packet.generatedAt).toLocaleDateString()}</p>
  </div>

  ${packet.notes.length > 0 ? `
  <div class="section">
    <h2>Important Notices</h2>
    ${packet.notes.map(note => `<div class="warning">${escapeHtml(note)}</div>`).join("")}
  </div>
  ` : ""}

  <div class="section page-break">
    <h2>Cover Letter</h2>
    <pre style="font-family: Arial; white-space: pre-wrap; word-wrap: break-word;">${escapeHtml(packet.coverLetter)}</pre>
  </div>

  <div class="section">
    <h2>Forms to File</h2>
    <table>
      <thead>
        <tr>
          <th>Form Number</th>
          <th>Title</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${packet.formOrder.map(form => `
        <tr>
          <td><strong>${escapeHtml(form.formNumber)}</strong></td>
          <td>${escapeHtml(form.title)}</td>
          <td>${escapeHtml(form.status)}</td>
        </tr>
        `).join("")}
      </tbody>
    </table>
  </div>

  <div class="section info">
    <h2>Filing Fee Information</h2>
    <p><strong>Payable To:</strong> ${escapeHtml(packet.filingFee.payableTo)}</p>
    <table>
      <thead>
        <tr>
          <th>Form</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${packet.filingFee.forms.map(f => `
        <tr>
          <td>${escapeHtml(f.form)}</td>
          <td>$${f.amount}</td>
        </tr>
        `).join("")}
        <tr class="fee-total">
          <td>TOTAL:</td>
          <td>$${packet.filingFee.amount}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section info page-break">
    <h2>USCIS Mailing Address</h2>
    <div class="address">${escapeHtml(packet.mailingAddress.formatted)}</div>
  </div>

  <div class="section">
    <h2>Document Checklist</h2>
    <ul class="checklist">
      ${packet.documentChecklist.map(doc => `
      <li>
        ${escapeHtml(doc.name)}
        ${doc.required ? '<span style="color: red;"> (Required)</span>' : ""}
      </li>
      `).join("")}
    </ul>
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
