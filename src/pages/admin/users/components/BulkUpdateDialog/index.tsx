import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { exportUsers } from "../../utils/exportUsers";
import { ImportProgress } from "../ImportDialog/ImportProgress";
import { ProcessingResultView } from "../ImportDialog/ProcessingResult";
import { UploadArea } from "../ImportDialog/UploadArea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BulkUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateComplete: () => void;
}

export function BulkUpdateDialog({
  open,
  onOpenChange,
  onUpdateComplete,
}: BulkUpdateDialogProps) {
  const [step, setStep] = useState<'export' | 'upload' | 'processing'>('export');
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState({ processed: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = async () => {
    try {
      await exportUsers((processed) => {
        setProgress({ processed, total: 100 });
      });
      setStep('upload');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export users');
    }
  };

  const handleProcessingComplete = (file: File) => {
    setFile(file);
    setIsProcessing(false);
  };

  const handleUpdate = async () => {
    if (!file) return;

    try {
      setStep('processing');
      
      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke('manage-users-bulk', {
        body: { action: 'update', file: await file.text() }
      });

      if (error) throw error;

      toast.success('Users updated successfully');
      onUpdateComplete();
      onOpenChange(false);
    } catch (error) {
      console.error('Update error:', error);
      setError(error instanceof Error ? error.message : 'Failed to update users');
      toast.error('Failed to update users');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bulk Update Users</DialogTitle>
        </DialogHeader>

        {step === 'export' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              First, export the current user data to update:
            </p>
            <Button onClick={handleExport}>Export Users</Button>
          </div>
        )}

        {step === 'upload' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload the modified CSV file to update users:
            </p>
            <UploadArea
              isProcessing={isProcessing}
              onProcessingComplete={handleProcessingComplete}
            />
            {file && (
              <Button onClick={handleUpdate} className="w-full">
                Update Users
              </Button>
            )}
          </div>
        )}

        {step === 'processing' && (
          <>
            <ImportProgress
              progress={{ processed: progress.processed, total: progress.total }}
              paused={false}
              onPauseToggle={() => {}}
              onCancel={() => onOpenChange(false)}
            />
            {error && (
              <ProcessingResultView
                processingResult={null}
                importResult={{
                  successful: 0,
                  failed: 1,
                  errors: [{
                    row: 0,
                    type: 'validation',
                    message: error
                  }]
                }}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}