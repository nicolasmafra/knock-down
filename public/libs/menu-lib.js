const menuLib = {
    data: {
        title: "Main Menu",
        children: {}
    },
    stack: [],
    stackMin: 0,
    container: null,
    component: null,
    invisibleClass: 'menu-invisible',
    titleClass: 'menu-title',
    itemClass: 'menu-item',
    selectedClass: 'menu-selected',
    selected: -1,

    start: function(container, component) {
        if (!container) {
            container = document.getElementsByClassName("menu-container")[0];
        }
        if (!component) {
            component = document.getElementsByClassName("menu-content")[0];
        }
        this.container = container;
        this.component = component;
        this.render();
        this.show();
    },

    moveDown: function() {
        if (!this.component.children) return;
        const max = this.getMenuItems().length - 1;
        if (this.selected < max) {
            this.selected++;
            this.renderSelected();
        }
    },

    moveUp: function() {
        if (!this.component.children) return;
        if (this.selected > 0) {
            this.selected--;
            this.renderSelected();
        }
    },

    select: function(menuKey) {
        let current = this.currentMenu();
        if (!menuKey && current.children) {
            menuKey = Object.keys(current.children)[this.selected];
        }
        if (!menuKey) return;
        
        if (!current.children || !current.children[menuKey]) {
            throw new Error("Invalid menu: " + menuKey);
        }
        let child = current.children[menuKey];
        if (child.action) {
            child.action();
        } else {
            this.stack.push(menuKey);
            this.render();
        }
    },

    setCurrentMenu(stack) {
        this.stack = stack;
        this.render();
    },

    back: function() {
        if (this.stack.length <= this.stackMin) return;
        
        this.stack.pop();
        this.render();
    },

    backToRoot: function() {
        this.setCurrentMenu([]);
    },

    currentMenu: function() {
        let current = this.data;
        this.stack.forEach(menuKey => current = current.children[menuKey]);
        return current;
    },

    show: function() {
        this.container.style.display = null;
    },

    hide: function() {
        this.container.style.display = 'none';
    },

    isVisible: function() {
        return this.container.style.display !== 'none';
    },

    render: function() {
        this.selected = -1;
        let current = this.currentMenu();
        this.component.innerHTML = '';

        let titleElement = document.createElement("div");
        titleElement.innerHTML = current.title;
        titleElement.classList.add(this.titleClass);
        this.component.appendChild(titleElement);

        if (!current.children) {
            return;
        }
        Object.entries(current.children).forEach(([key, menuItem]) => {
            let element = document.createElement("div");
            element.innerHTML = menuItem.title;
            element.classList.add(this.itemClass);

            let action = menuItem.action
                ? menuItem.action
                : () => this.select(key);
            element.addEventListener('click', action);

            this.component.appendChild(element);
        });
    },

    renderSelected: function() {
        if (!this.component.children) return;

        this.getMenuItems().forEach((element,i) => {
            if (i == this.selected) {
                element.classList.add(this.selectedClass);
            } else {
                element.classList.remove(this.selectedClass);
            }
        });
    },

    getMenuItems: function() {
        let menuItems = [];
        for (var i = 0; i < this.component.children.length; i++) {
            let element = this.component.children[i];
            if (element.classList.contains(this.itemClass)) {
                menuItems.push(element);
            }
        }
        return menuItems;
    },
};

export default menuLib;
