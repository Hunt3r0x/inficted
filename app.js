new Vue({
    el: '#app',
    components: {
        paginate: VuejsPaginate
    },
    data: {
        search: '',
        jsonData: [], // This will hold the fetched JSON data
        perPage: 10, // Number of entries per page (initial value)
        currentPage: 1
    },
    computed: {
        filteredData() {
            if (!this.search) {
                return this.jsonData;
            }
            return this.jsonData.filter(entry =>
                Object.values(entry).some(value =>
                    String(value).toLowerCase().includes(this.search.toLowerCase())
                )
            );
        },
        pageCount() {
            return Math.ceil(this.filteredData.length / this.perPage);
        },
        paginatedData() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredData.slice(start, end);
        },
        displayedPageNumbers() {
            const totalPageNumbers = this.pageCount;
            const maxDisplayedPages = 5; // Adjust this number as needed
            const middlePage = Math.ceil(maxDisplayedPages / 2);
            let startPage, endPage;

            if (totalPageNumbers <= maxDisplayedPages) {
                startPage = 1;
                endPage = totalPageNumbers;
            } else if (this.currentPage <= middlePage) {
                startPage = 1;
                endPage = maxDisplayedPages;
            } else if (this.currentPage > totalPageNumbers - middlePage) {
                startPage = totalPageNumbers - maxDisplayedPages + 1;
                endPage = totalPageNumbers;
            } else {
                startPage = this.currentPage - Math.floor(middlePage / 2);
                endPage = this.currentPage + Math.floor(middlePage / 2);
            }

            return Array.from({ length: (endPage - startPage) + 1 }, (_, i) => startPage + i);
        }
    },
    methods: {
        changePage(page) {
            if (page >= 1 && page <= this.pageCount) {
                this.currentPage = page;
            }
        },
        toggleCard(entry) {
            entry.expanded = !entry.expanded;
        }
    },
    mounted() {
        // Fetch JSON data and set to jsonData
        fetch('data.json') // Replace with your actual JSON data URL
            .then(response => response.json())
            .then(data => {
                this.jsonData = data.map(entry => ({ ...entry, expanded: false })); // Set fetched JSON data to jsonData
            })
            .catch(error => {
                console.error('Error fetching JSON data:', error);
            });
    }
});
