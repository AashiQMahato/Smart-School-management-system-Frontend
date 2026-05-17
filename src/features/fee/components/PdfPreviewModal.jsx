/**
 * PdfPreviewModal
 * Shows a generated jsPDF document in a modal first,
 * then downloads only when the user clicks Download.
 */

import { useEffect, useMemo, useState } from "react";
import { Modal, Spin, Alert, Button } from "antd";

function docToBlobUrl(doc) {
  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
}

export default function PdfPreviewModal({
  open,
  title = "PDF Preview",
  build,
  fileName,
  onClose,
  onDownloaded,
  width = 900,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [docRef, setDocRef] = useState(null);
  const [computedFileName, setComputedFileName] = useState(null);

  const modalTitle = useMemo(
    () => (
      <div>
        <div className="text-lg font-semibold text-slate-900">{title}</div>
        <div className="text-xs text-slate-500">
          Preview first — download when ready
        </div>
      </div>
    ),
    [title],
  );

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const result = await build?.();
        const doc = result?.doc || result; // allow returning doc directly
        if (!doc) throw new Error("Could not generate PDF");

        const url = docToBlobUrl(doc);
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }

        setDocRef(doc);
        setBlobUrl(url);
        setComputedFileName(result?.fileName || null);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to generate PDF");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, build]);

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  const handleCancel = () => {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlobUrl(null);
    setDocRef(null);
    setError(null);
    setLoading(false);
    setComputedFileName(null);
    onClose?.();
  };

  const handleDownload = () => {
    if (!docRef) return;
    const name = fileName || computedFileName || "document.pdf";
    docRef.save(name);
    onDownloaded?.();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      title={modalTitle}
      width={width}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button onClick={handleCancel}>Close</Button>
          <Button
            type="primary"
            onClick={handleDownload}
            disabled={!docRef || loading || !!error}
            className="bg-blue-600">
            Download PDF
          </Button>
        </div>
      }
      className="[&_.ant-modal-content]:rounded-2xl [&_.ant-modal-content]:overflow-hidden"
      destroyOnClose>
      <div className="min-h-[70vh] bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
        {loading ? (
          <div className="flex items-center justify-center h-[70vh]">
            <Spin size="large" />
          </div>
        ) : error ? (
          <div className="p-4">
            <Alert type="error" message={error} showIcon />
          </div>
        ) : blobUrl ? (
          <iframe
            title="pdf-preview"
            src={blobUrl}
            className="w-full h-[70vh]"
            style={{ border: "none" }}
          />
        ) : (
          <div className="flex items-center justify-center h-[70vh]">
            <Spin />
          </div>
        )}
      </div>
    </Modal>
  );
}
