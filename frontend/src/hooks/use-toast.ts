import { toast as shadcnToast } from "@/components/ui/toast";

type ToastProps = {
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    variant?: "default" | "destructive";
    action?: any;
};

function toastAdapter(props: ToastProps) {
    const type = props.variant === 'destructive' ? 'error' : 'info';
    return shadcnToast.add({
        title: props.title,
        description: props.description,
        type: type,
    } as any);
}

export const useToast = () => {
    return {
        toast: toastAdapter,
        dismiss: (id?: string) => {
            if (id) shadcnToast.close(id as any);
        }
    }
}

export const toast = toastAdapter;
