// 响应式处理工具类
class ResponsiveHandler {
    constructor() {
        this.breakpoints = {
            mobile: 768,
            tablet: 1024,
            desktop: 1440
        };
        this.currentBreakpoint = null;
        this.callbacks = new Map();
        this.init();
    }

    init() {
        // 初始化媒体查询监听
        this.setupMediaQueries();
        
        // 初始化触摸设备检测
        this.setupTouchDetection();
        
        // 初始化方向变化监听
        this.setupOrientationChange();
        
        // 初始化减少动画监听
        this.setupReducedMotion();
    }

    setupMediaQueries() {
        const queries = {
            mobile: `(max-width: ${this.breakpoints.mobile}px)`,
            tablet: `(min-width: ${this.breakpoints.mobile + 1}px) and (max-width: ${this.breakpoints.tablet}px)`,
            desktop: `(min-width: ${this.breakpoints.tablet + 1}px)`
        };

        Object.entries(queries).forEach(([device, query]) => {
            const mq = window.matchMedia(query);
            mq.addListener((e) => this.handleBreakpointChange(device, e.matches));
            this.handleBreakpointChange(device, mq.matches);
        });
    }

    setupTouchDetection() {
        const isTouchDevice = ('ontouchstart' in window) || 
                            (navigator.maxTouchPoints > 0) || 
                            (navigator.msMaxTouchPoints > 0);
        
        document.documentElement.classList.toggle('touch-device', isTouchDevice);
    }

    setupOrientationChange() {
        window.addEventListener('orientationchange', () => {
            this.callbacks.get('orientation')?.forEach(callback => callback());
        });
    }

    setupReducedMotion() {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        document.documentElement.classList.toggle('reduced-motion', reducedMotion.matches);
        
        reducedMotion.addListener((e) => {
            document.documentElement.classList.toggle('reduced-motion', e.matches);
        });
    }

    handleBreakpointChange(device, matches) {
        if (matches) {
            this.currentBreakpoint = device;
            document.documentElement.setAttribute('data-device', device);
            this.callbacks.get(device)?.forEach(callback => callback());
        }
    }

    onBreakpoint(breakpoint, callback) {
        if (!this.callbacks.has(breakpoint)) {
            this.callbacks.set(breakpoint, new Set());
        }
        this.callbacks.get(breakpoint).add(callback);
        
        return () => this.callbacks.get(breakpoint).delete(callback);
    }

    getCurrentBreakpoint() {
        return this.currentBreakpoint;
    }

    isTouchDevice() {
        return document.documentElement.classList.contains('touch-device');
    }

    isReducedMotion() {
        return document.documentElement.classList.contains('reduced-motion');
    }
}

// 导出实例
export const responsiveHandler = new ResponsiveHandler(); 