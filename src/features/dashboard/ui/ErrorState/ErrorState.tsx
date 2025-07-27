import { Button } from "@/shared/ui";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={onRetry}>
          다시 시도
        </Button>
      </div>
    </div>
  );
} 