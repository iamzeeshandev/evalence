import Button from '@/components/core/button';
import { Field } from '@/components/core/hook-form';
import { NestedOption } from '@/components/core/hook-form/select-group-field';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { AlertTriangle } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDeleteLevel, useGetLevelForest } from '@/requests/company/company-api';
import { LevelForest } from '@/requests/company/company-type';

const formSchema = z
  .object({
    action: z.enum(['cancel', 'substitute']),
    substituteLevel: z.string().optional(),
  })
  .refine(data => data.action !== 'substitute' || data.substituteLevel, {
    message: 'Substitute level is required',
    path: ['substituteLevel'],
  });

interface ConfirmationLevelDialogProps {
  open: boolean;
  message?: string;
  loading?: boolean;
  levelTree?: NestedOption[];
  onClose: () => void;
  onConfirm: (data: { action: 'cancel' | 'substitute'; substituteLevel?: string }) => void;
}

export function ConfirmationLevelDialog({
  open,
  onClose,
  message,
  loading,
  onConfirm,
}: ConfirmationLevelDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      action: 'cancel',
      substituteLevel: undefined,
    },
  });

  const { data: levelTree = [] } = useGetLevelForest();
  const action = form.watch('action');

  async function onSubmit(data: z.infer<typeof formSchema>) {
    onConfirm({
      action: data.action,
      substituteLevel: data.action === 'substitute' ? data.substituteLevel : undefined,
    });
  }

  const transformLevelToOptions = (apiData: LevelForest): NestedOption[] => {
    return apiData.map(item => ({
      value: item.id.toString(),
      label: item.title,
      is_grade_required: item.isGradeRequired,
      children: transformLevelToOptions(item.children || []),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={value => !value && onClose()}>
      <DialogContent className="sm:max-w-[625px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Confirmation</DialogTitle>
            </DialogHeader>

            <div className="my-4 space-y-4">
              <Alert className="border-yellow-500 bg-yellow-50 text-yellow-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Warning: If the current level is associated with any open shift(s) or
                  candidate(s), it cannot be deleted. Alternatively, you may select the option below
                  to provide a substitute level.
                </AlertDescription>
              </Alert>
              <div className="flex flex-col gap-4 px-2">
                <p className="text-gray-700">
                  {message ?? 'Are you sure you want to delete this item?'}
                </p>

                <Field.RadioGroup
                  name="action"
                  options={[
                    { value: 'cancel', label: 'Proceed without substitution' },
                    { value: 'substitute', label: 'Apply on alternative level as substitute' },
                  ]}
                  direction="vertical"
                />

                {action === 'substitute' && (
                  <Field.NestedSelect
                    name="substituteLevel"
                    label="Substitute Level"
                    placeholder="Select substitute level"
                    options={transformLevelToOptions(levelTree)}
                  />
                )}
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={loading}
                disabled={loading}
              >
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
