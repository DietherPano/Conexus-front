class SPA {

    routes = [];

    constructor(config = {}) {
      this.context = {
        root: config?.root || document.getElementById('app'),
      };
  
      this.defaultRoute = {
        key: '*',
        callback: (config?.defaultRoute || (() => { })).bind(this.context),
      };
    }

    add(path, cb) {
      this.routes.push({
        key: path,
        callback: cb.bind(this.context),
      });
    }

    get(path) {
      const route = this.routes.find(r => (r.key instanceof RegExp && r.key.test(path)) || r.key === path);
      return route || this.defaultRoute;
    }

    execute(path) {
      const route = this.get(path);
      let params;
  
      if (route?.key && route?.key instanceof RegExp) {
        params = route.key.exec(window.location.pathname);
  
        if (params?.groups && Object.keys(params?.groups).length > 0) {
          params = params.groups;
        } else {
          params = Array.from(params);
          params?.shift();
        }
      }
  
      route?.callback(params);
    }

    navigate(path){
      history.pushState({}, '', path);
      this.execute(path)
    }

    setDefault(cb) {
      this.defaultRoute = {
        key: '*',
        callback: cb,
      };
    }

    handleRouteChanges() {
        window.addEventListener('popstate', () => {
          this.execute(window.location.pathname);
        });
      
        document.addEventListener('click', (e) => {
          const link = e.target.closest('a');
          if (!link) return;
      
          const href = link.getAttribute('href');
          const target = link.getAttribute('target') || '_self';
      
          if (href && target === '_self' && href.startsWith('/')) {
            e.preventDefault();

            history.pushState({}, '', href);
            this.execute(window.location.pathname);
      
            const targetUrl = new URL(href, window.location.origin);
            if (targetUrl.hash) {
              const focusElem = document.querySelector(targetUrl.hash);
              if (focusElem) {
                setTimeout(() => focusElem.scrollIntoView({
                  behavior: 'smooth', block: 'end', inline: 'nearest'
                }), 500);
              }
            }
          }
        });

        document.addEventListener('click', (e) => {
            const button = e.target.closest('button[data-path]');
            if(button){
                e.preventDefault();
                 
                const path = button.getAttribute('data-path');
                if (path){
                    history.pushState({}, '', path);
                    this.execute(path)
                }
            }
        })
      
        this.execute(window.location.pathname);
      }
  }
  
  export default SPA;