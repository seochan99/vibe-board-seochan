import { SortOption } from '@/entities/board';

interface SortOptionsProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
}

export function SortOptions({ sortBy, onSortChange }: SortOptionsProps) {
  const sortOptions = [
    { value: 'recent', label: '최신순' },
    { value: 'name', label: '이름순' },
    { value: 'activity', label: '활동순' },
    { value: 'created', label: '생성순' },
  ] as const;

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700">정렬:</span>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent transition-colors text-[#333]"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value} className="text-[#333]">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
} 