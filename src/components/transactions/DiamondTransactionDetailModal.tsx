'use client';

import { ModalWrapper } from '@/components/shared/ModalWrapper';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useDiamondTransactionDetail } from '@/hooks/useTransactions';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface Props {
    open: boolean;
    onClose: () => void;
    transactionId?: string;
}

export function DiamondTransactionDetailModal({
    open,
    onClose,
    transactionId,
}: Props) {
    const { data, isLoading } = useDiamondTransactionDetail(
        open ? transactionId : undefined,
    );

    return (
        <ModalWrapper open={open} onClose={onClose} title="Chi Tiết Giao Dịch Kim Cương" size="lg">
            {isLoading && (
                <div className="flex justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            )}

            {data && (
                <div className="space-y-5 pt-2">
                    <section className="rounded-lg border border-border p-4">
                        <h3 className="mb-3 text-sm font-semibold">Người Dùng</h3>
                        <div className="flex items-center gap-3">
                            {data.user?.avatar && (
                                <img
                                    src={data.user.avatar}
                                    alt={data.user.username}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                            )}
                            <div>
                                <p className="text-sm font-medium">{data.user?.username ?? '—'}</p>
                                <p className="text-xs text-muted-foreground">{data.user?.email ?? '—'}</p>
                                <p className="text-xs text-muted-foreground">{data.user?.fullName ?? '—'}</p>
                            </div>
                        </div>
                    </section>

                    <section className="grid grid-cols-2 gap-3 text-sm">
                        <Info label="Mã Giao Dịch" value={data.txnRef} />
                        <Info label="Trạng Thái" value={<StatusBadge status={data.status} />} />
                        <Info label="Gói" value={data.diamondPackage} />
                        <Info label="Kim Cương" value={`${data.diamondAmount.toLocaleString()} + ${data.bonusDiamondAmount.toLocaleString()} thưởng`} />
                        <Info label="Số Tiền" value={`${data.amountVnd.toLocaleString('vi-VN')}₫`} />
                        <Info label="Phương Thức Thanh Toán" value={data.paymentMethod} />
                        <Info label="Ngân Hàng" value={data.vnpBankCode ?? '—'} />
                        <Info label="Mã Giao Dịch VNP" value={data.vnpTransactionNo ?? '—'} />
                        <Info label="Mã Giao Dịch Ngân Hàng" value={data.vnpBankTranNo ?? '—'} />
                        <Info label="Loại Thẻ" value={data.vnpCardType ?? '—'} />
                        <Info label="Mã Phản Hồi" value={data.vnpResponseCode ?? '—'} />
                        <Info label="Ngày Thanh Toán" value={data.vnpPayDate ?? '—'} />
                        <Info label="IPN Đã Xử Lý" value={data.ipnProcessed ? 'Có' : 'Không'} />
                        <Info
                            label="Tạo Lúc"
                            value={format(new Date(data.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                        />
                    </section>
                </div>
            )}
        </ModalWrapper>
    );
}

function Info({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <div className="mt-1 break-all font-medium">{value}</div>
        </div>
    );
}
