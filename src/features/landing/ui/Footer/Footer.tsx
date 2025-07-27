import { Logo } from "@/shared/ui";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <Logo size="sm" />
          <div className="text-sm text-gray-500">
            © 2024 Vibe Board. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
} 