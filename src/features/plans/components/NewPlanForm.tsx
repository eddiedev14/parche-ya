import { useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  addOutline,
  closeOutline,
  locationOutline,
  removeOutline,
} from "ionicons/icons";

import { LocationPickerModal } from "./LocationPickerModal";
import { CategoryChip } from "@/shared/components/CategoryChip";
import { FieldGroup } from "@/shared/components/FieldGroup";
import { Input } from "@/shared/components/Input";
import { InputError } from "@/shared/components/InputError";
import { OptionSegment } from "@/shared/components/OptionSegment";
import { Textarea } from "@/shared/components/Textarea";
import { CATEGORIES } from "@/shared/helpers/constants";
import {
  CAPACITY,
  DESCRIPTION_MAX,
  DURATION_OPTIONS,
  START_OPTIONS,
} from "@/features/plans/constants";
import { useNewPlanForm } from "@/features/plans/hooks/useNewPlanForm";
import { useCurrentLocation } from "@/shared/hooks/useCurrentLocation";

interface Props {
  onClose: () => void;
}

export const NewPlanForm = ({ onClose }: Props) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const { form } = useNewPlanForm({ onClose });
  const { loading, getCurrentLocation } = useCurrentLocation();

  const category = form.getControlProps("category");
  const startInMinutes = form.getControlProps("startInMinutes");
  const startTime = form.getFieldProps("startTime");
  const durationHours = form.getControlProps("durationHours");
  const durationMinutes = form.getFieldProps("durationMinutes");
  const capacity = form.getControlProps("capacity");
  const location = form.getControlProps("location");

  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton aria-label="Cerrar" onClick={onClose}>
              <IonIcon slot="icon-only" icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Nuevo plan</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <form
          noValidate
          onSubmit={form.handleSubmit}
          className="flex flex-col gap-6 px-4 py-4"
        >
          <Input
            label="Título"
            placeholder="Ej: Partido de fútbol 5"
            {...form.getFieldProps("title")}
          />

          <FieldGroup legend="Categoría">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((item) => (
                <CategoryChip
                  key={item.id}
                  category={item}
                  selected={category.value === item.id}
                  onClick={() => category.onChange(item.id)}
                />
              ))}
            </div>
            <InputError message={category.error} />
          </FieldGroup>

          <Textarea
            label="Descripción (opcional)"
            rows={3}
            counterMax={DESCRIPTION_MAX}
            {...form.getFieldProps("description")}
          />

          <FieldGroup legend="Cuándo empieza">
            {/* -1: ningún segmento queda marcado mientras se use la hora exacta */}
            <OptionSegment
              options={START_OPTIONS}
              {...startInMinutes}
              value={startTime.value ? -1 : startInMinutes.value}
              onChange={(value) => {
                startTime.onChange("");
                startInMinutes.onChange(value);
              }}
            />
            <Input
              type="time"
              className="mt-3"
              label="O elige una hora exacta (hoy)"
              {...startTime}
            />
          </FieldGroup>

          <FieldGroup legend="Duración">
            <OptionSegment
              options={DURATION_OPTIONS}
              {...durationHours}
              value={durationMinutes.value ? -1 : durationHours.value}
              onChange={(value) => {
                durationMinutes.onChange("");
                durationHours.onChange(value);
              }}
            />
            <Input
              type="number"
              className="mt-3"
              inputmode="numeric"
              label="O escribe los minutos"
              placeholder="Ej: 90"
              {...durationMinutes}
            />
          </FieldGroup>

          <FieldGroup legend="Cupos totales">
            <div className="flex items-center justify-center gap-6">
              <IonButton
                fill="outline"
                shape="round"
                aria-label="Quitar un cupo"
                disabled={capacity.value <= CAPACITY.min}
                onClick={() => capacity.onChange(capacity.value - 1)}
              >
                <IonIcon slot="icon-only" icon={removeOutline} />
              </IonButton>
              <span
                aria-live="polite"
                className="font-heading text-h2 text-ink min-w-10 text-center"
              >
                {capacity.value}
              </span>
              <IonButton
                fill="outline"
                shape="round"
                aria-label="Agregar un cupo"
                disabled={capacity.value >= CAPACITY.max}
                onClick={() => capacity.onChange(capacity.value + 1)}
              >
                <IonIcon slot="icon-only" icon={addOutline} />
              </IonButton>
            </div>
            <p className="text-caption text-muted text-center">
              Cuentas tú. Mínimo {CAPACITY.min}, máximo {CAPACITY.max}.
            </p>
          </FieldGroup>

          <Input
            label="Nombre del lugar"
            placeholder="Ej: Cancha del campus"
            {...form.getFieldProps("locationName")}
          />

          <FieldGroup legend="Ubicación en el mapa">
            <IonButton
              fill="outline"
              disabled={loading}
              onClick={async () => {
                const coordinates = await getCurrentLocation();
                if (coordinates) location.onChange(coordinates);
              }}
            >
              {loading ? (
                <IonSpinner name="crescent" />
              ) : (
                "Usar mi ubicación actual"
              )}
            </IonButton>
            <IonButton
              size="small"
              fill="outline"
              onClick={() => setPickerOpen(true)}
            >
              <IonIcon slot="start" icon={locationOutline} />
              {location.value ? "Cambiar ubicación" : "Elegir en el mapa"}
            </IonButton>
            {location.value && (
              <p className="text-caption text-success">Ubicación elegida</p>
            )}
            <InputError message={location.error} />
          </FieldGroup>
        </form>
      </IonContent>

      <IonFooter className="ion-no-border">
        <IonToolbar className="px-4 pt-2 pb-[max(36px,var(--ion-safe-area-bottom))]">
          <IonButton
            expand="block"
            className="m-0"
            disabled={form.submitting}
            onClick={() => form.handleSubmit()}
          >
            {form.submitting ? <IonSpinner name="crescent" /> : "Publicar plan"}
          </IonButton>
        </IonToolbar>
      </IonFooter>

      <LocationPickerModal
        isOpen={pickerOpen}
        initial={location.value}
        onClose={() => setPickerOpen(false)}
        onConfirm={(coordinates) => {
          location.onChange(coordinates);
          setPickerOpen(false);
        }}
      />
    </>
  );
};
