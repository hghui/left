// 性能优化工具类
class PerformanceOptimizer {
    constructor() {
        this.observers = new Map();
        this.intersectionObserver = null;
        this.resizeObserver = null;
        this.mutationObserver = null;
        this.rafCallbacks = new Set();
        this.init();
    }

    init() {
        // 初始化 Intersection Observer
        this.intersectionObserver = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { threshold: 0.1, rootMargin: '50px' }
        );

        // 初始化 Resize Observer
        this.resizeObserver = new ResizeObserver(
            (entries) => this.handleResize(entries)
        );

        // 初始化 RAF 循环
        this.initRAFLoop();

        // 添加性能监控
        this.initPerformanceMonitoring();
    }

    // 处理元素可见性
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const callback = this.observers.get(entry.target);
                if (callback) {
                    callback(entry);
                    this.intersectionObserver.unobserve(entry.target);
                }
            }
        });
    }

    // 处理元素大小变化
    handleResize(entries) {
        entries.forEach(entry => {
            const callback = this.observers.get(entry.target);
            if (callback) callback(entry);
        });
    }

    // 初始化 RAF 循环
    initRAFLoop() {
        const loop = () => {
            this.rafCallbacks.forEach(callback => callback());
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    // 添加 RAF 回调
    addRAFCallback(callback) {
        this.rafCallbacks.add(callback);
        return () => this.rafCallbacks.delete(callback);
    }

    // 初始化性能监控
    initPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'longtask') {
                        console.warn('Long task detected:', entry);
                    }
                }
            });
            observer.observe({ entryTypes: ['longtask'] });
        }
    }

    // 图片懒加载
    lazyLoadImage(img) {
        this.intersectionObserver.observe(img);
        this.observers.set(img, (entry) => {
            if (entry.isIntersecting) {
                const src = img.dataset.src;
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                }
            }
        });
    }

    // 动画节流
    throttleAnimation(element, animationClass, options = {}) {
        this.intersectionObserver.observe(element);
        this.observers.set(element, (entry) => {
            if (entry.isIntersecting) {
                element.classList.add(animationClass);
                if (options.once) {
                    this.intersectionObserver.unobserve(element);
                }
            } else if (!options.once) {
                element.classList.remove(animationClass);
            }
        });
    }

    // 清理资源
    cleanup() {
        this.intersectionObserver.disconnect();
        this.resizeObserver.disconnect();
        this.observers.clear();
        this.rafCallbacks.clear();
    }
}

// 导出实例
export const performanceOptimizer = new PerformanceOptimizer(); 