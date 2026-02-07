export type MagentoOrder = {
  id: string;
  total: number;
  createdAt: string;
};

export type MagentoProduct = {
  id: string;
  name: string;
  price: number;
};

export interface MagentoConnector {
  fetchOrders(): Promise<MagentoOrder[]>;
  fetchProducts(): Promise<MagentoProduct[]>;
}

export class MagentoConnectorStub implements MagentoConnector {
  async fetchOrders(): Promise<MagentoOrder[]> {
    // TODO: Replace with Magento REST API call.
    return [];
  }

  async fetchProducts(): Promise<MagentoProduct[]> {
    // TODO: Replace with Magento REST API call.
    return [];
  }
}
