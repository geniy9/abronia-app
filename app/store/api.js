import { defineStore } from 'pinia'

export const useApiStore = defineStore('api', {
  state: () => ({

    selectedCategory: null,

    searchValue: '',

    categories: [],
    samples: [],
    products: [],
    invoices: [],
    orders: [],
    customers: [],
    comments: [],

    invoice: null,

    loadingSamples: false,
    loadingProducts: false,
    loadingInvoices: false,
    loadingOrders: false,
    loadingCustomers: false,
    loadingComments: false,

    totalSamples: 0,
    totalProducts: 0,
    totalInvoices: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalComments: 0,

    hasSamples: null,
    hasProducts: null,
    hasInvoices: null,
    hasOrders: null,
    hasCustomers: null,
    hasComments: null,

    pageSize: 24,
    currentPage: 1,
  }),

  getters: {

    getterCategory(state) {
      return state.products.length > 0 ? state.products[0]?.category : null
    },

    getterInvoice(state) {
      if (state.invoice) {
        return {
          ...state.invoice,
          attachments: Array.isArray(state.invoice.attachments) ? state.invoice.attachments : []
        };
      }
      return state.invoice;
    },

  },

  actions: {

    async getCategories() {
      try {
        this.loadingCategories = true
        const { find } = useStrapi()
        const res = await find('categories', { 
          sort: ["sort_id:asc"]
        })
        if (res) this.categories = res.data
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        this.loadingCategories = false
      }
    },

    async getInvoices() {
      try {
        this.loadingInvoices = true
        const { find } = useStrapi()
        const res = await find('invoices', { 
          sort: ["shipmentDate:asc"]
        })
        if (res?.data) { 
          this.invoices = res.data
          this.hasInvoices = res.meta?.pagination?.total || 0
          this.totalInvoices = res.meta?.pagination?.total || 0
        } else {
          this.invoices = []
          this.hasInvoices = null
          this.totalInvoices = 0
        }
      } catch (error) {
        console.error("Error fetching invoices:", error)
      } finally {
        this.loadingInvoices = false
      }
    },

    async getInvoicesByYear(year) {
      try {
        this.loadingInvoices = true
        const { find } = useStrapi()
        const startDate = `${year}-01-01T00:00:00.000Z`;
        const endDate = `${year}-12-31T23:59:59.999Z`;
        const res = await find('invoices', {
          sort: ["createdAt:desc"],
          filters: {
            shipmentDate: { $gte: startDate, $lte: endDate }
          }
        })
        if (res) this.invoices = res.data
      } catch (error) {
        console.error("Error fetching invoices:", error)
      } finally {
        this.loadingInvoices = false
      }
    },

    async getInvoice(id) {
      try {
        this.loadingInvoices = true
        const { findOne } = useStrapi()
        const res = await findOne('invoices', id, {
          populate: { 
            order: {
              populate: {
                customer: true,
                productItems: { populate: ['product'] }
              },
            },
            attachments: true,
            comment: true
          }
        })
        if (res?.data) {
          this.invoice = res.data
        } else {
          this.invoice = null
        }
      } catch (error) {
        console.error("Error fetching invoice:", error)
        this.invoice = null
      } finally {
        this.loadingInvoices = false
      }
    },

    addAttachmentsToInvoice(newAttachments) {
      if (!this.invoice) {
        console.warn('Нет активного инвойса для добавления вложений.');
        return;
      }
      if (!Array.isArray(this.invoice.attachments)) {
        this.invoice.attachments = [];
      }
      const existingAttachmentIds = this.invoice.attachments.map(att => att.id);
      const uniqueNewAttachments = newAttachments.filter(newAtt => !existingAttachmentIds.includes(newAtt.id));
      this.invoice.attachments = [...uniqueNewAttachments, ...this.invoice.attachments]
    },

    async getOrders() {
      try {
        this.loadingOrders = true
        const { find } = useStrapi()
        const res = await find('orders', {
          sort: ["createdAt:desc"],
          populate: { customer: true }
        })
        if (res?.data) { 
          this.orders = res.data
          this.hasOrders = res.meta?.pagination?.total || 0
          this.totalOrders = res.meta?.pagination?.total || 0
        } else {
          this.orders = []
          this.hasOrders = null
          this.totalOrders = 0
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        this.loadingOrders = false
      }
    },

    async getCustomers() {
      try {
        this.loadingCustomers = true
        const { find } = useStrapi()
        const res = await find('customers', {
          sort: ["name:asc"],
          populate: {
            contacts: true,
            comment: true
          }
        })
        if (res?.data) { 
          this.customers = res.data
          this.hasCustomers = res.meta?.pagination?.total || 0
          this.totalCustomers = res.meta?.pagination?.total || 0
        } else {
          this.customers = []
          this.hasCustomers = null
          this.totalCustomers = 0
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        this.loadingCustomers = false
      }
    },

    async getComments() {
      try {
        this.loadingComments = true
        const { find } = useStrapi()
        const res = await find('comments', {
          sort: ["createdAt:desc"]
        })
        if (res?.data) { 
          this.comments = res.data
          this.hasComments = res.meta?.pagination?.total || 0
          this.totalComments = res.meta?.pagination?.total || 0
        } else {
          this.comments = []
          this.hasComments = null
          this.totalComments = 0
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        this.loadingComments = false
      }
    },

    async getSamples() {
      this.loadingSamples = true
      const { find } = useStrapi()
      try {
        const res = await find('samples', {
          sort: ["name:asc"],
          pagination: {
            page: this.currentPage,
            pageSize: this.pageSize
          }
        });
        if (res?.data) {
          this.samples = res.data
          this.totalSamples = res.meta?.pagination?.total || 0;
          this.hasSamples = res.meta?.pagination?.total || 0
        } else {
          this.samples = [];
          this.totalSamples = 0;
          this.hasSamples = null
        }
      } catch (error) {
        console.error("Ошибка запроса образцов:", error);
        this.samples = [];
        this.totalSamples = 0;
        this.hasSamples = null
      } finally {
        this.loadingSamples = false;
      }
    },

    async getProducts() {
      this.loadingProducts = true
      const { find } = useStrapi()
      try {
        const res = await find('products', {
          sort: ["name:asc"],
          populate: { category: true },
          pagination: {
            page: this.currentPage,
            pageSize: this.pageSize
          }
        });
        if (res?.data) {
          this.products = res.data
          this.totalProducts = res.meta?.pagination?.total || 0
          this.hasProducts = res.meta?.pagination?.total || 0
        } else {
          this.products = []
          this.totalProducts = 0
          this.hasProducts = null
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        this.products = []
        this.totalProducts = 0
        this.hasProducts = null
      } finally {
        this.loadingProducts = false
      }
    },

    async getProductsByCategory(docId) {
      this.loadingProducts = true
      const { find } = useStrapi()
      try {
        const res = await find('products', {
          sort: ["name:asc"],
          populate: { category: true },
          filters: { 
            category: { documentId: { $eq: docId } } 
          },
          pagination: {
            page: this.currentPage,
            pageSize: this.pageSize
          }
        });
        if (res?.data) {
          this.products = res.data
          this.totalProducts = res.meta?.pagination?.total || 0;
          this.hasProducts = res.meta?.pagination?.total || 0
        } else {
          this.products = [];
          this.totalProducts = 0;
          this.hasProducts = null
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        this.products = [];
        this.totalProducts = 0;
        this.hasProducts = null
      } finally {
        this.loadingProducts = false;
      }
    },

    resetProducts() {
      this.selectedCategory = null
      this.products.length = 0
      this.searchValue = ''
      this.getProducts()
    },

    // async paginate(value, id = null) {
    //   this.products.length = 0
    //   this.currentPage = value
    //   if (id) {
    //     await this.getProductsByCategory(id)
    //   } else {
    //     await this.getProducts()
    //   }
    // },

    addEntryToState(api, obj) {
      switch (api) {
        case 'samples': this.samples = this.samples.unshift(obj);
        break;
        case 'products': this.products = this.products.unshift(obj);
        break;
        case 'invoices': this.invoices = this.invoices.unshift(obj);
        break;
        case 'orders': this.orders = this.orders.unshift(obj);
        break;
        case 'customers': this.customers = this.customers.unshift(obj);
        break;
        case 'comments': this.comments = this.comments.unshift(obj);
        break;
        default: console.warn(`Неизвестный тип API: ${api}`);
      }
    },

    removeEntryFromState(api, id) {
      switch (api) {
        case 'samples': this.samples = this.samples.filter(i => i.documentId !== id);
        break;
        case 'products': this.products = this.products.filter(i => i.documentId !== id);
        break;
        case 'invoices': this.invoices = this.invoices.filter(i => i.documentId !== id);
        break;
        case 'orders': this.orders = this.orders.filter(i => i.documentId !== id);
        break;
        case 'customers': this.customers = this.customers.filter(i => i.documentId !== id);
        break;
        case 'comments': this.comments = this.comments.filter(i => i.documentId !== id);
        break;
        default: console.warn(`Неизвестный тип API: ${api}`);
      }
    }

  },

})