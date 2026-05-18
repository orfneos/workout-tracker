import Button from './Button';

interface ConfirmModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal = ({ message, onConfirm, onCancel }: ConfirmModalProps) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
                <p className="text-gray-800 text-center mb-6">{message}</p>
                <div className="flex gap-4 justify-center">
                    <Button variant="danger" onClick={onConfirm}>
                        Delete
                    </Button>
                    <Button variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;