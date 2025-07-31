new Vue({
    el: '#app',
    components: {
        paginate: VuejsPaginate
    },
    data: {
        search: '',
        jsonData: [], // This will hold the fetched JSON data
        perPage: 12, // Number of entries per page (initial value)
        currentPage: 1,
        maxDisplayedPages: 5, // Maximum number of displayed page numbers
        loading: true,
        selectedGroup: '',
        sortBy: 'published',
        sortOrder: 'desc',
        groupsData: [] // Will hold groups data
    },
    computed: {
        filteredData() {
            let filtered = this.jsonData;
            
            // Apply search filter
            if (this.search) {
                const searchTerm = this.search.toLowerCase();
                filtered = filtered.filter(entry =>
                    Object.values(entry).some(value =>
                        String(value).toLowerCase().includes(searchTerm)
                    )
                );
            }
            
            // Apply group filter
            if (this.selectedGroup) {
                filtered = filtered.filter(entry => 
                    entry.group_name === this.selectedGroup
                );
            }
            
            // Apply sorting
            return filtered.sort((a, b) => {
                let aValue = a[this.sortBy];
                let bValue = b[this.sortBy];
                
                // Handle dates specifically
                if (this.sortBy === 'published') {
                    aValue = new Date(aValue);
                    bValue = new Date(bValue);
                }
                
                if (this.sortOrder === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
        },
        
        uniqueGroups() {
            return [...new Set(this.jsonData.map(entry => entry.group_name))].sort();
        },
        
        totalEntries() {
            return this.jsonData.length;
        },
        
        activeGroups() {
            return this.uniqueGroups.length;
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
                // Scroll to top when changing pages
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },
        
        toggleCard(entry) {
            this.$set(entry, 'expanded', !entry.expanded);
        },
        
        clearSearch() {
            this.search = '';
            this.currentPage = 1;
        },
        
        formatDate(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) return 'Today';
            if (diffDays === 2) return 'Yesterday';
            if (diffDays <= 7) return `${diffDays - 1} days ago`;
            if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
            if (diffDays <= 365) return `${Math.floor(diffDays / 30)} months ago`;
            return `${Math.floor(diffDays / 365)} years ago`;
        },
        
        formatDateFull(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        
        getGroupClass(groupName) {
            // Create consistent color classes based on group name
            const hash = groupName.split('').reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
            }, 0);
            const colors = ['red', 'blue', 'green', 'purple', 'orange', 'pink', 'teal', 'indigo'];
            return `group-${colors[Math.abs(hash) % colors.length]}`;
        },
        
        openLink(url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        },
        
        shareIncident(entry) {
            if (navigator.share) {
                navigator.share({
                    title: `Security Incident: ${entry.post_title}`,
                    text: `${entry.group_name} - ${entry.post_title}`,
                    url: entry.post_url || window.location.href
                });
            } else {
                // Fallback for browsers without Web Share API
                const text = `${entry.post_title} - ${entry.group_name}\n${entry.post_url || window.location.href}`;
                navigator.clipboard.writeText(text).then(() => {
                    alert('Incident details copied to clipboard!');
                });
            }
        },
        
        exportData() {
            const dataToExport = this.filteredData.map(entry => ({
                title: entry.post_title,
                group: entry.group_name,
                published: entry.published,
                url: entry.post_url,
                description: entry.description
            }));
            
            const csv = this.convertToCSV(dataToExport);
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `zleaks-export-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        },
        
        convertToCSV(data) {
            const headers = Object.keys(data[0]);
            const csvContent = [
                headers.join(','),
                ...data.map(row => 
                    headers.map(header => 
                        `"${String(row[header] || '').replace(/"/g, '""')}"`
                    ).join(',')
                )
            ].join('\n');
            return csvContent;
        },
        async fetchData() {
            this.loading = true;
            try {
                // Try to fetch from the main API first
                const response = await fetch('https://data.ransomware.live/posts.json');
                if (!response.ok) {
                    throw new Error('Primary API failed');
                }
                const data = await response.json();
                this.jsonData = data.map(entry => ({ ...entry, expanded: false }));
                console.log(`Loaded ${data.length} incidents from primary API`);
            } catch (error) {
                console.error('Error fetching from primary API, trying fallback:', error);
                await this.useLocalData();
            } finally {
                this.loading = false;
            }
        },
        
        async useLocalData() {
            try {
                const response = await fetch('https://raw.githubusercontent.com/joshhighet/ransomwatch/refs/heads/main/posts.json');
                if (!response.ok) {
                    throw new Error('Fallback API failed');
                }
                const data = await response.json();
                this.jsonData = data.map(entry => ({ ...entry, expanded: false }));
                console.log(`Loaded ${data.length} incidents from fallback API`);
            } catch (error) {
                console.error('Error fetching fallback data, trying local:', error);
                await this.useOfflineData();
            }
        },
        
        async useOfflineData() {
            try {
                const response = await fetch('resources/js/db/posts.json');
                if (!response.ok) {
                    throw new Error('Local data failed');
                }
                const data = await response.json();
                this.jsonData = data.map(entry => ({ ...entry, expanded: false }));
                console.log(`Loaded ${data.length} incidents from local storage`);
            } catch (error) {
                console.error('All data sources failed:', error);
                this.jsonData = [];
                // Show user-friendly error message
                this.showErrorMessage();
            }
        },
        
        showErrorMessage() {
            // Create a simple error display
            const errorData = [{
                post_title: 'Unable to load data',
                group_name: 'System',
                published: new Date().toISOString(),
                description: 'We are experiencing technical difficulties loading the incident data. Please try refreshing the page.',
                post_url: '',
                expanded: false
            }];
            this.jsonData = errorData;
        }
    },
    
    watch: {
        // Reset to first page when filters change
        search() {
            this.currentPage = 1;
        },
        selectedGroup() {
            this.currentPage = 1;
        },
        sortBy() {
            this.currentPage = 1;
        },
        sortOrder() {
            this.currentPage = 1;
        }
    },
    
    mounted() {
        this.fetchData();
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.querySelector('.search-input').focus();
            }
            
            // ESC to clear search
            if (e.key === 'Escape' && this.search) {
                this.clearSearch();
            }
        });
        
        // Add smooth scrolling behavior
        document.documentElement.style.scrollBehavior = 'smooth';
    }
});
