import { CategoryChip } from "@/shared/components/CategoryChip";
import { CATEGORIES, CATEGORY_ALL } from "@/shared/helpers/constants";
import type { CategoryFilter } from "../types/plans.types";

interface Props {
  selected: CategoryFilter;
  onChange: (category: CategoryFilter) => void;
}

const FILTER_CHIPS = [CATEGORY_ALL, ...CATEGORIES];

export const CategoryFilterBar = ({ selected, onChange }: Props) => (
  <div className="flex gap-2 overflow-x-auto scrollbar-none">
    {FILTER_CHIPS.map((chip) => (
      <CategoryChip
        key={chip.id}
        category={chip}
        selected={selected === chip.id}
        onClick={() => onChange(chip.id)}
      />
    ))}
  </div>
);
