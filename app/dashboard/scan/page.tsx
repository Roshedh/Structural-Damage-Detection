import ImageUploader from "@/components/image-uploader"

export default function Dashboard() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Analysis Console</h1>
        <p className="text-muted-foreground mt-1">
          Upload images of structural components for instant neural-network analysis.
        </p>
      </div>
      <ImageUploader />
    </div>
  )
}
