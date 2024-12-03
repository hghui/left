// 动画优化工具类
class AnimationOptimizer {
    constructor() {
        this.animations = new Map();
        this.frameCallbacks = new Set();
        this.init();
    }

    init() {
        this.setupRAF();
        this.setupIntersectionObserver();
    }

    setupRAF() {
        let lastTime = 0;
        const animate = (currentTime) => {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            this.frameCallbacks.forEach(callback => callback(deltaTime));
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const animation = this.animations.get(entry.target);
                    if (animation) {
                        if (entry.isIntersecting) {
                            animation.play();
                        } else {
                            animation.pause();
                        }
                    }
                });
            },
            { threshold: 0.1 }
        );
    }

    addAnimation(element, options) {
        const animation = element.animate(options.keyframes, options.timing);
        this.animations.set(element, animation);
        this.observer.observe(element);
        
        return {
            play: () => animation.play(),
            pause: () => animation.pause(),
            cancel: () => {
                animation.cancel();
                this.animations.delete(element);
                this.observer.unobserve(element);
            }
        };
    }

    addFrameCallback(callback) {
        this.frameCallbacks.add(callback);
        return () => this.frameCallbacks.delete(callback);
    }

    cleanup() {
        this.animations.forEach(animation => animation.cancel());
        this.animations.clear();
        this.frameCallbacks.clear();
        this.observer.disconnect();
    }
}

// 导出实例
export const animationOptimizer = new AnimationOptimizer(); 