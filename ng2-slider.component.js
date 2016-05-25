"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var slideable_directive_1 = require('ng2-slideable-directive/slideable.directive');
(function (RangeHandle) {
    RangeHandle[RangeHandle["Start"] = 0] = "Start";
    RangeHandle[RangeHandle["End"] = 1] = "End";
    RangeHandle[RangeHandle["Both"] = 2] = "Both";
})(exports.RangeHandle || (exports.RangeHandle = {}));
var RangeHandle = exports.RangeHandle;
var Ng2SliderComponent = (function () {
    function Ng2SliderComponent(CDR, _elementRef) {
        this.CDR = CDR;
        this._elementRef = _elementRef;
        this.rangeChangedEvent = new core_1.EventEmitter();
        this.isRange = true;
        this.handlers = {
            Start: null,
            End: null
        };
        this.initialStartValue = null;
        this.initialEndValue = null;
        this.initNormalHandlerStyle = {
            width: '18px',
            height: '18px',
            border: 'solid 1px red',
            position: 'absolute',
            'background-color': 'yellow',
        };
        this.initSlidingHandlerStyle = {};
        this.initRangeRibbonStyle = {
            left: '0%',
            width: '100%',
            height: '10px',
            border: 'solid 1px',
            position: 'absolute',
            top: '4px'
        };
        this.resultNormalHandlerStyle = {};
        this.resultSlidingHandlerStyle = {};
        this.resultRangeRibbonStyle = {};
        this.instance = this;
    }
    Object.defineProperty(Ng2SliderComponent.prototype, "value", {
        set: function (value) {
            this.startValue = parseFloat(value);
        },
        enumerable: true,
        configurable: true
    });
    Ng2SliderComponent.prototype.ngOnInit = function () {
        if (this.startValue != null && this.endValue == null)
            this.isRange = false;
        Object.assign(this.initSlidingHandlerStyle, this.initNormalHandlerStyle);
        Object.assign(this.resultNormalHandlerStyle, this.initNormalHandlerStyle, this.normalHandlerStyle);
        Object.assign(this.resultSlidingHandlerStyle, this.initSlidingHandlerStyle, this.slidingHandlerStyle);
        Object.assign(this.resultRangeRibbonStyle, this.initRangeRibbonStyle, this.rangeRibbonStyle);
        var rangeRangeRibbonStyle = '';
        for (var idx in this.resultRangeRibbonStyle) {
            rangeRangeRibbonStyle += idx + ':' + this.resultRangeRibbonStyle[idx] + ';';
        }
        this.resultRangeRibbonStyle = rangeRangeRibbonStyle;
    };
    Ng2SliderComponent.prototype.refreshInputBox = function (boundingRect, handle) {
        var value = this.range.calculateValueFromX(boundingRect.left + Math.round(boundingRect.width / 2));
        switch (handle) {
            case RangeHandle.Start:
                this.startValue = value.toString();
                break;
            case RangeHandle.End:
                this.endValue = value.toString();
                break;
            default:
                break;
        }
        this.CDR.detectChanges();
        this.CDR.markForCheck();
        return value;
    };
    Ng2SliderComponent.prototype.valueChanged = function (el, handle) {
        if (handle === void 0) { handle = RangeHandle.Both; }
        if (handle == RangeHandle.Both || handle == RangeHandle.Start) {
            this.startValue = this.initialStartValue + Math.round((this.startValue - this.initialStartValue) / this.stepValue) * this.stepValue;
            if (parseFloat(this.startValue) > parseFloat(this.endValue)) {
                this.startValue = this.initialStartValue + Math.floor((this.endValue - this.initialStartValue) / this.stepValue) * this.stepValue;
            }
            if (parseFloat(this.startValue) < parseFloat(this.min)) {
                this.startValue = this.initialStartValue + Math.ceil((this.min - this.initialStartValue) / this.stepValue) * this.stepValue;
            }
            this.handlers.Start.redraw(this.range.calculateXFromValue(this.startValue), 0);
        }
        if (handle == RangeHandle.Both || handle == RangeHandle.End) {
            this.endValue = this.initialEndValue + Math.round((this.endValue - this.initialEndValue) / this.stepValue) * this.stepValue;
            if (parseFloat(this.startValue) > parseFloat(this.endValue)) {
                this.endValue = this.initialEndValue + Math.ceil((this.endValue - this.initialEndValue) / this.stepValue) * this.stepValue;
            }
            if (parseFloat(this.endValue) > parseFloat(this.max)) {
                this.endValue = this.initialEndValue + Math.floor((this.max - this.initialEndValue) / this.stepValue) * this.stepValue;
            }
            this.handlers.End.redraw(this.range.calculateXFromValue(this.endValue), 0);
        }
        this.CDR.markForCheck();
        this.CDR.detectChanges();
    };
    Ng2SliderComponent.prototype.ngAfterViewInit = function () {
        if (!this.min)
            this.min = this._elementRef.nativeElement.attributes.getNamedItem('min').value;
        if (!this.max)
            this.max = this._elementRef.nativeElement.attributes.getNamedItem('max').value;
        if (!this.startValue && this._elementRef.nativeElement.attributes.getNamedItem('value')) {
            this.startValue = this._elementRef.nativeElement.attributes.getNamedItem('value').value;
            if (this.startValue != null && this.endValue == null)
                this.isRange = false;
        }
        if (!this.startValue)
            this.startValue = this._elementRef.nativeElement.attributes.getNamedItem('startValue').value;
        if (!this.endValue && this.isRange)
            this.endValue = this._elementRef.nativeElement.attributes.getNamedItem('endValue').value;
        if (!this.stepValue && this._elementRef.nativeElement.attributes.getNamedItem('stepValue'))
            this.stepValue = this._elementRef.nativeElement.attributes.getNamedItem('stepValue').value;
        if (!this.stepValue)
            this.stepValue = 1;
        this.initialStartValue = parseFloat(this.startValue);
        this.initialEndValue = parseFloat(this.endValue);
        if (!this._elementRef.nativeElement.id) {
            this.id = Math.random().toString(36).slice(2, 10);
            this._elementRef.nativeElement.id = this.id;
        }
        else {
            this.id = this._elementRef.nativeElement.id;
        }
        this.range = new Range({
            element: this.ribbon.nativeElement,
            min: this.min,
            max: this.max
        });
        this.stepX = this.range.calculateStepX(this.stepValue);
    };
    Ng2SliderComponent.prototype.rangeChangedTrigger = function () {
        this.rangeChangedEvent.emit(this);
    };
    Ng2SliderComponent.prototype.setStartValue = function (v) {
        this.startValue = v;
        this.valueChanged(RangeHandle.Start);
        this.CDR.detectChanges();
        this.CDR.markForCheck();
    };
    Ng2SliderComponent.prototype.setEndValue = function (v) {
        this.endValue = v;
        this.valueChanged(RangeHandle.End);
        this.CDR.detectChanges();
        this.CDR.markForCheck();
    };
    Ng2SliderComponent.prototype.onStopSliding = function (event) {
        this.rangeChangedTrigger();
    };
    Ng2SliderComponent.prototype.onSliding = function (event) {
        var handle = RangeHandle.Both;
        if (event.elementId == this.id + '-left-handle')
            handle = RangeHandle.Start;
        if (event.elementId == this.id + '-right-handle')
            handle = RangeHandle.End;
        this.refreshInputBox(event.boundingRect, handle);
    };
    Ng2SliderComponent.prototype.initHandlers = function (name, event) {
        event.instance.checkXBeforeRedraw = function (x, y) {
            return true;
        };
        this.handlers[name] = event.instance;
        if (name == 'Start')
            this.valueChanged({}, RangeHandle.Start);
        if (name == 'End')
            this.valueChanged({}, RangeHandle.End);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Ng2SliderComponent.prototype, "min", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Ng2SliderComponent.prototype, "max", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Ng2SliderComponent.prototype, "startValue", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Ng2SliderComponent.prototype, "endValue", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Ng2SliderComponent.prototype, "stepValue", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String), 
        __metadata('design:paramtypes', [String])
    ], Ng2SliderComponent.prototype, "value", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Ng2SliderComponent.prototype, "normalHandlerStyle", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Ng2SliderComponent.prototype, "slidingHandlerStyle", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Ng2SliderComponent.prototype, "rangeRibbonStyle", void 0);
    __decorate([
        core_1.Output('onRangeChanged'), 
        __metadata('design:type', Object)
    ], Ng2SliderComponent.prototype, "rangeChangedEvent", void 0);
    __decorate([
        core_1.ViewChild('ribbon'), 
        __metadata('design:type', core_1.ElementRef)
    ], Ng2SliderComponent.prototype, "ribbon", void 0);
    __decorate([
        core_1.ViewChild('start'), 
        __metadata('design:type', core_1.ElementRef)
    ], Ng2SliderComponent.prototype, "startRef", void 0);
    __decorate([
        core_1.ViewChild('end'), 
        __metadata('design:type', core_1.ElementRef)
    ], Ng2SliderComponent.prototype, "endRef", void 0);
    __decorate([
        core_1.ViewChild('startInput'), 
        __metadata('design:type', core_1.ElementRef)
    ], Ng2SliderComponent.prototype, "startInputRef", void 0);
    __decorate([
        core_1.ViewChild('endInput'), 
        __metadata('design:type', core_1.ElementRef)
    ], Ng2SliderComponent.prototype, "endInputRef", void 0);
    Ng2SliderComponent = __decorate([
        core_1.Component({
            selector: 'ng2-slider',
            templateUrl: './ng2-slider.component.html',
            directives: [slideable_directive_1.SlideAbleDirective],
            changeDetection: core_1.ChangeDetectionStrategy.CheckAlways
        }), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef, core_1.ElementRef])
    ], Ng2SliderComponent);
    return Ng2SliderComponent;
}());
exports.Ng2SliderComponent = Ng2SliderComponent;
var Range = (function () {
    function Range(config) {
        this.config = config;
        if (typeof (this.config.min == 'string'))
            this.config.min = parseFloat(this.config.min);
        if (typeof (this.config.max == 'string'))
            this.config.max = parseFloat(this.config.max);
        this.boundingRect = config.element.getBoundingClientRect();
    }
    Range.prototype.calculatePercentFromValue = function (value) {
        return Math.round(100 * (value - this.config.min) / (this.config.max - this.config.min));
    };
    Range.prototype.calculateXFromValue = function (value) {
        return this.boundingRect.left + Math.round((this.boundingRect.right - this.boundingRect.left) * (value - this.config.min) / (this.config.max - this.config.min));
    };
    Range.prototype.calculatePercentFromX = function (x) {
        return Math.round(100 * (x - this.boundingRect.left) / (this.boundingRect.right - this.boundingRect.left));
    };
    Range.prototype.calculateValueFromX = function (x) {
        return this.config.min + Math.round((this.config.max - this.config.min) * (x - this.boundingRect.left) / (this.boundingRect.right - this.boundingRect.left));
    };
    Range.prototype.calculateStepX = function (step) {
        return step * (this.boundingRect.right - this.boundingRect.left) / (this.config.max - this.config.min);
    };
    Range.prototype.getLeftX = function () {
        return this.boundingRect.left;
    };
    Range.prototype.getRightX = function () {
        return this.boundingRect.right;
    };
    return Range;
}());
exports.Range = Range;
//# sourceMappingURL=ng2-slider.component.js.map