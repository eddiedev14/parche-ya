import { useForm } from "@/shared/hooks/useForm";
import {
  EMPTY_NEW_PLAN,
  validateNewPlan,
} from "@/features/plans/validations/newPlan.validation";
import { Toast } from "@/shared/classes/Toast.class";
import { useAuth } from "@/features/auth";
import { usePlans } from "./usePlans";
import { Plan } from "@/shared/types/plan.types";
import { CategoryId } from "@/shared/helpers/constants";
import {
  minutesToTimestamp,
  minutesUntilTime,
} from "@/shared/helpers/plan.helper";

interface Props {
  onClose: () => void;
}

export const useNewPlanForm = ({ onClose }: Props) => {
  const { user } = useAuth();
  const { isPending, createPlan } = usePlans();

  //* Form controller
  const form = useForm({
    initialValues: EMPTY_NEW_PLAN,
    validate: validateNewPlan,
    onSubmit: async (values) => {
      if (!user) return;

      const startMinutes = values.startTime
        ? minutesUntilTime(values.startTime)
        : values.startInMinutes;
      const durationMinutes = values.durationMinutes
        ? Number(values.durationMinutes)
        : values.durationHours * 60;

      const plan: Plan = {
        title: values.title,
        description: values.description,
        category: values.category as CategoryId,
        location: {
          label: values.locationName,
          lat: values.location?.lat as number,
          lng: values.location?.lng as number,
        },
        startAt: minutesToTimestamp(startMinutes),
        expiresAt: minutesToTimestamp(startMinutes + durationMinutes),
        capacity: values.capacity,
        creatorId: user.id,
        creatorName: user.displayName,
        creatorPhotoUrl: user.photoUrl,
        status: "active",
      };

      const error = await createPlan(plan);
      if (error) {
        Toast.error(error);
        return;
      }

      Toast.success("Plan creado correctamente");
      onClose();
    },
  });

  return { form, isPending };
};
