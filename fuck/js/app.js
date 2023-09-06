new Vue({
    el: '#app',
    components: {
        paginate: VuejsPaginate
    },
    data: {
        search: '',
        jsonData: [], // This will hold the fetched JSON data
        perPage: 6, // Number of entries per page (initial value)
        currentPage: 1,
        maxDisplayedPages: 5 // Maximum number of displayed page numbers
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
            const middlePage = Math.ceil(this.maxDisplayedPages / 2);
            let startPage, endPage;

            if (totalPageNumbers <= this.maxDisplayedPages) {
                startPage = 1;
                endPage = totalPageNumbers;
            } else if (this.currentPage <= middlePage) {
                startPage = 1;
                endPage = this.maxDisplayedPages;
            } else if (this.currentPage > totalPageNumbers - middlePage) {
                startPage = totalPageNumbers - this.maxDisplayedPages + 1;
                endPage = totalPageNumbers;
            } else {
                startPage = this.currentPage - Math.floor(this.maxDisplayedPages / 2);
                endPage = this.currentPage + Math.floor(this.maxDisplayedPages / 2);
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
        fetch('https://raw.githubusercontent.com/JMousqueton/ransomware.live/main/posts.json')
            .then(response => response.json())
            .then(data => {
                this.jsonData = data.map(entry => ({ ...entry, expanded: false }));
            })
            .catch(error => {
                console.error('Error fetching JSON data:', error);
            });
    }
});
