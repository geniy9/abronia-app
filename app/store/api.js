import { defineStore } from 'pinia'

export const useApiStore = defineStore('api', {
  state: () => ({

    selectedCategory: null,

    searchValue: '',

    categories: [],
    products: [],
    invoices: [],
    orders: [],
    customers: [],
    comments: [],

    loadingCategories: false,
    loadingProducts: false,
    loadingInvoices: false,
    loadingOrders: false,
    loadingCustomers: false,
    loadingComments: false,

    totalProducts: 0,
    totalInvoices: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalComments: 0,

    hasProduct: null,
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
    }

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

    async getOrders() {
      try {
        this.loadingOrders = true
        const { find } = useStrapi()
        const res = await find('orders', {
          populate: {
            customer: true
          },
          sort: ["createdAt:asc"]
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
          populate: {
            contacts: true,
            comment: true
          },
          sort: ["createdAt:asc"]
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

    async fetchProducts() {
      this.loadingProducts = true
      const { find } = useStrapi()
      
      const finalFilters = {}
      const trimmedSearchValue = this.searchValue?.trim()

      if (trimmedSearchValue) {
        finalFilters.$or = [
          { name: { $containsi: trimmedSearchValue } },
          { sku: { $containsi: trimmedSearchValue } }
        ]
      } else {
        const fitmentFilters = {};

        if (Object.keys(fitmentFilters).length > 0) {
          finalFilters.fitments = fitmentFilters
          this.selectedCategory = null
        } else if (this.selectedCategory?.length > 0) {
          finalFilters.category = { slug: { $eq: this.selectedCategory[0].slug } }
        }
      }

      try {
        const res = await find('products', {
          populate: {
            category: true,
            variants: { populate: ['images'] }
          },
          filters: finalFilters,
          pagination: {
            page: this.currentPage,
            pageSize: this.pageSize
          }
        });

        if (res?.data) {
          this.products = res.data
          this.totalProducts = res.meta?.pagination?.total || 0
          this.hasProduct = res.meta?.pagination?.total || 0
        } else {
          this.products = []
          this.totalProducts = 0
          this.hasProduct = null
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        this.products = []
        this.totalProducts = 0
        this.hasProduct = null
      } finally {
        this.loadingProducts = false
      }
    },

    async getProductsByCategory(docId) {
      this.loadingProducts = true
      const { find } = useStrapi()
      try {
        const res = await find('products', {
          populate: {
            category: true,
            // variants: { populate: ['images'] }
          },
          filters: { 
            category: { 
              documentId: { $eq: docId } 
            } 
          },
          pagination: {
            page: this.currentPage,
            pageSize: this.pageSize
          }
        });
        if (res?.data) {
          this.products = res.data
          this.totalProducts = res.meta?.pagination?.total || 0;
          this.hasProduct = res.meta?.pagination?.total || 0
        } else {
          this.products = [];
          this.totalProducts = 0;
          this.hasProduct = null
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        this.products = [];
        this.totalProducts = 0;
        this.hasProduct = null
      } finally {
        this.loadingProducts = false;
      }
    },

    resetProducts() {
      this.selectedCategory = null
      this.products.length = 0
      this.searchValue = ''
      this.fetchProducts()
    },

    async paginate(value, categorySlug = null) {
      this.products.length = 0
      this.currentPage = value
      if (categorySlug) {
        await this.getProductsByCategory(categorySlug)
      } else {
        await this.fetchProducts()
      }
    },

  },

})