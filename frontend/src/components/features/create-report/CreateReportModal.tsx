"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCreateReport } from "@/context/CreateReportProvider";
import { PlusCircle } from "lucide-react";

export function CreateReportModal() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<
    "DRAFT" | "SUBMITTED" | "REVIEWED" | "APPROVED"
  >("DRAFT");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { createReport } = useCreateReport();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await createReport({
        content,
        userId: "user-id", // Replace with actual user ID from authentication context
        date,
        status,
      });

      if (result.success) {
        setOpen(false);
        setContent("");
        setDate("");
        setStatus("DRAFT");
        router.refresh();
      } else {
        setError(
          result.error || "An error occurred while creating the report."
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setContent("");
          setDate("");
          setStatus("DRAFT");
          setError("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="h-4 w-4 mr-2" />
          <span className="flex items-center">New Report</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Report</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
              required
              placeholder="Enter the content of the report"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(
                value: "DRAFT" | "SUBMITTED" | "REVIEWED" | "APPROVED"
              ) => setStatus(value)}
            >
              <SelectTrigger disabled={isLoading}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="SUBMITTED">Submitted</SelectItem>
                <SelectItem value="REVIEWED">Reviewed</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Report"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
