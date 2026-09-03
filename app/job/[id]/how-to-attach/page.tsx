"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import HowUploadPage from "@/app/how-upload/page";

/**
 * D3 sits between the job detail and the portal: the same explainer, but
 * its exit goes on to the employer's page instead of back.
 */
export default function HowToAttachPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  return <HowUploadPage onDone={() => router.push(`/job/${id}/apply`)} />;
}
