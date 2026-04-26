
import { repairOrderAPI } from "../api/repairOrderApi";
import { quotationAPI } from "../api/quotationApi";
import { formatDate, formatPrice } from "../utils/utils";

export const fetchRepairOrders = async () => {
    try {
        const response = await repairOrderAPI.getMine();
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy thông tin lịch sử đơn sửa chữa: `, error);
    }
};

export const fetchQuotationsByOrder = async (orderId) => {
    try {
        const response = await quotationAPI.getQuotationById(orderId);
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy báo giá theo đơn ${orderId}:`, error);
    }
};

export const transformQuotation = (quote, repairOrder) => {
    const status = quote.status?.toLowerCase() || "pending";

    const items = (quote.details || []).map((detail) => [
        detail.itemName,
        formatPrice(detail.subtotal),
    ]);

    const total = formatPrice(quote.totalPrice);

    const date = formatDate(quote.createdAt);

    const car = repairOrder?.vehicleId ?
        `${repairOrder.vehicleBrand} ${repairOrder.vehicleModel} (${repairOrder.vehicleLicensePlate})` : `Phương tiện #${repairOrder?.id || "N/A"}`;
    const service = repairOrder?.serviceType || "Dịch vụ sửa chữa";

    return {
        id: `BG-${quote.id}`,
        quoteId: quote.id,
        repairOrderId: quote.repairOrderId,
        date,
        car,
        service,
        status,
        items,
        details: quote.details || [],
        total,
        totalPrice: quote.totalPrice,
        note: quote.technicianNote || quote.note || null,
    };
};

export const fetchAllQuotations = async () => {
    try {
        const repairOrders = await fetchRepairOrders();

        const quotationPromises = repairOrders.map((order) =>
            fetchQuotationsByOrder(order.id)
                .then((quotations) => ({
                    order,
                    quotations,
                }))
                .catch((error) => {
                    console.error(`Error fetching quotations for order ${order.id}:`, error);
                    return {
                        order,
                        quotations: [],
                    };
                })
        );

        const results = await Promise.all(quotationPromises);

        const transformedQuotes = results.flatMap(({ order, quotations }) => {
            if (!quotations || quotations.length === 0) {
                return [{
                    id: `BG-${order.id}`,
                    quoteId: null,
                    repairOrderId: order.id,
                    date: formatDate(order.createdAt),
                    car: `${order.vehicleBrand} ${order.vehicleModel} (${order.vehicleLicensePlate})`,
                    service: order.serviceType || "Dịch vụ sửa chữa",
                    status: "no_quote",
                    items: [],
                    details: [],
                    total: "0₫",
                    totalPrice: 0,
                    note: "Chưa có báo giá",
                    isEmpty: true,
                }];
            }
            return quotations.map((quote) => transformQuotation(quote, order));
        });

        return transformedQuotes;
    } catch (error) {
        console.error("Error fetching all quotations:", error);
        throw error;
    }
};

export const getStatusConfig = () => ({
    pending: {
        label: "Chờ duyệt", color: "#FFB84D",
        bg: "rgba(255,184,77,.1)", key: "PENDING",
    },
    approved: {
        label: "Đã duyệt", color: "#4CAF50",
        bg: "rgba(76,175,80,.1)", key: "APPROVED",
    },
    rejected: {
        label: "Từ chối", color: "#FF5B6B",
        bg: "rgba(255,91,107,.1)", key: "REJECTED",
    },
    no_quote: {
        label: "Chưa có báo giá",
        color: "#999",
        bg: "rgba(0,0,0,.3)",
        key: "NO_QUOTE",
    },
});

export const getStatusConfigByKey = (status) => {
    const config = getStatusConfig();
    const normalizedStatus = status?.toLowerCase() || "pending";
    return config[normalizedStatus] || config.pending;
};