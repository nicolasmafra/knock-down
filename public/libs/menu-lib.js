const menuLib = {
    data: {
        title: "Main Menu",
        children: {}
    },
    stack: [],
    container: null,
    component: null,
    invisibleClass: 'menu-invisible',
    titleClass: 'menu-title',
    itemClass: 'menu-item',

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

    select: function(menuKey) {
        let current = this.currentMenu();
        if (!current.children || !current.children[menuKey]) {
            throw new Error("Invalid menu: " + menuKey);
        }
        this.stack.push(menuKey);
        this.render();
    },

    setCurrentMenu(stack) {
        this.stack = stack;
        this.render();
    },

    back: function() {
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

    render: function() {
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
};

export default menuLib;
