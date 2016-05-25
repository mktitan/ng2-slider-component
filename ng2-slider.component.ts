/**
 * Created by User on 21.03.2016.
 */

declare var module: any;
declare var __moduleName: string;

import {Component, Input, Output, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter} from '@angular/core'
import {SlideAbleDirective, BoundingRectClass, IEventSlideAble} from 'ng2-slideable-directive/slideable.directive';


export enum RangeHandle {Start, End, Both}

@Component({
    selector: 'ng2-slider',
    template: `<div class="slider-input-block">
                    <input type="number"
                           id="{{id + '-start-value'}}"
                           class="slider-input-box"
                           name="{{id + '-start-value'}}"
                           [step]="stepValue"
                           [min]="min"
                           [max]="max"
                           [(ngModel)]="startValue"
                           (change)="valueChanged($event, 0)"
                           #startInput
                           />
                </div>
                <div *ngIf="isRange" class="slider-input-block">
                    <input type="number"
                           id="{{id + '-end-value'}}"
                           class="slider-input-box"
                           name="{{id + '-end-value'}}"
                           [step]="stepValue"
                           [min]="min"
                           [max]="max"
                           [(ngModel)]="endValue"
                           (change)="valueChanged($event, 1)"
                           #endInput
                           />
                </div>
                
                <div id="range-slider-container" style="clear:both; position:relative;"
                     class="ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all">
                    <div #ribbon
                         id="{{id + '-ribbon'}}"
                         class="ui-slider-range ui-widget-header ui-corner-all"
                         style="{{ (resultRangeRibbonStyle !=  null) ? resultRangeRibbonStyle : null }}">
                    </div>
                    <span #start
                          slideAble
                          slideDirection="horisontal"
                          boundElement="{{id + '-ribbon'}}"
                          dynamicRightLimit="{{(isRange == true) ? id + '-right-handle' : null}}"
                          (onStopSliding)="onStopSliding($event)"
                          (onSliding)="onSliding($event)"
                          (onInit)="initHandlers('Start', $event)"
                          [id]="id + '-left-handle'"
                          [parent]="instance"
                          [step]="stepX"
                          [normalStyle]="(resultNormalHandlerStyle !=  null) ? resultNormalHandlerStyle : null"
                          [slidingStyle]="(resultSlidingHandlerStyle !=  null) ? resultSlidingHandlerStyle : null"
                          class="ui-slider-handle ui-state-default ui-corner-all"
                          tabindex="0"
                          style="left: 0%;"></span>
                    <span *ngIf="isRange"
                          #end
                          slideAble
                          slideDirection="horisontal"
                          boundElement="{{id + '-ribbon'}}"
                          [dynamicLeftLimit]="id + '-left-handle'"
                          (onStopSliding)="onStopSliding($event)"
                          (onSliding)="onSliding($event)"
                          (onInit)="initHandlers('End', $event)"
                          [id]="id + '-right-handle'"
                          [step]="stepX"
                          [normalStyle]="(resultNormalHandlerStyle !=  null) ? resultNormalHandlerStyle : null"
                          [slidingStyle]="(resultSlidingHandlerStyle !=  null) ? resultSlidingHandlerStyle : null"
                          class="ui-slider-handle ui-state-default ui-corner-all"
                          tabindex="0"
                          style="left: 100%;"></span>
                </div>`,
    directives: [SlideAbleDirective],
    changeDetection: ChangeDetectionStrategy.CheckAlways
})

export class Ng2SliderComponent {

    @Input() min:any;
    @Input() max:any;
    @Input() startValue:any;
    @Input() endValue:any;
    @Input() stepValue: any;
    @Input() set value(value:string) {
        this.startValue = parseFloat(value);
    }

    @Input() normalHandlerStyle: Object;
    @Input() slidingHandlerStyle: Object;
    @Input() rangeRibbonStyle: Object;

    @Output('onRangeChanged') rangeChangedEvent = new EventEmitter();

    @ViewChild('ribbon') ribbon:ElementRef;
    @ViewChild('start') startRef:ElementRef;
    @ViewChild('end') endRef:ElementRef;
    @ViewChild('startInput') startInputRef:ElementRef;
    @ViewChild('endInput') endInputRef:ElementRef;

    private range: Range;
    private id;
    private isRange: boolean = true;

    private handlers: {
        Start: SlideAbleDirective,
        End: SlideAbleDirective
    } = {
        Start: null,
        End: null
    };
    private initialStartValue: any = null;
    private initialEndValue: any = null;

    private initNormalHandlerStyle = {
        width: '18px',
        height: '18px',
        border: 'solid 1px red',
        position: 'absolute',
        'background-color': 'yellow',
    };
    private initSlidingHandlerStyle = {};
    private initRangeRibbonStyle = {
        left: '0%',
        width: '100%',
        height: '10px',
        border: 'solid 1px',
        position: 'absolute',
        top: '4px'
    };

    private resultNormalHandlerStyle = {};
    private resultSlidingHandlerStyle = {};
    private resultRangeRibbonStyle:any = {};

    // Self-instance
    public instance: Ng2SliderComponent;

    private stepX: any;

    constructor(private CDR:ChangeDetectorRef, private _elementRef: ElementRef) {
        // Create self instance as property for comfortable providing it to SlideAble directive
        this.instance = this;
    }

    ngOnInit() {
        if (this.startValue != null && this.endValue == null) this.isRange = false;

        Object.assign(this.initSlidingHandlerStyle, this.initNormalHandlerStyle);
        Object.assign(this.resultNormalHandlerStyle, this.initNormalHandlerStyle, this.normalHandlerStyle);
        Object.assign(this.resultSlidingHandlerStyle, this.initSlidingHandlerStyle, this.slidingHandlerStyle);
        Object.assign(this.resultRangeRibbonStyle, this.initRangeRibbonStyle, this.rangeRibbonStyle);

        console.log(this.resultRangeRibbonStyle);
        console.log(this.initRangeRibbonStyle);
        console.log(this.rangeRibbonStyle);

        // Compile range ribbon style line from object
        var rangeRangeRibbonStyle = '';
        for (let idx in this.resultRangeRibbonStyle) {
            rangeRangeRibbonStyle += idx + ':' + this.resultRangeRibbonStyle[idx] + ';';
        }
        console.log(rangeRangeRibbonStyle);
        this.resultRangeRibbonStyle = rangeRangeRibbonStyle;

   }

    refreshInputBox(boundingRect, handle:RangeHandle) {
        let value = this.range.calculateValueFromX(boundingRect.left + Math.round(boundingRect.width / 2))
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
    }

    /**
     * Set new handle position when value was changed in input-box
     * @param handle
     */
    valueChanged(el: any, handle:RangeHandle = RangeHandle.Both) {

        if (handle == RangeHandle.Both || handle == RangeHandle.Start) {
            // Affixing start value to the step grid
            this.startValue = this.initialStartValue + Math.round((this.startValue - this.initialStartValue) / this.stepValue) * this.stepValue ;

            // Check for case when the start value is over the end value
            if (parseFloat(this.startValue) > parseFloat(this.endValue)) {
                this.startValue = this.initialStartValue + Math.floor((this.endValue - this.initialStartValue) / this.stepValue) * this.stepValue ;
            }

            // Check for case when the start value is under the minimal value
            if (parseFloat(this.startValue) < parseFloat(this.min)) {
                this.startValue = this.initialStartValue + Math.ceil((this.min - this.initialStartValue) / this.stepValue) * this.stepValue ;
            }

            // Force start handle to redrawing
            this.handlers.Start.redraw(this.range.calculateXFromValue(this.startValue), 0);
        }

        if (handle == RangeHandle.Both || handle == RangeHandle.End) {
            // Affixing end value to the step grid
            this.endValue = this.initialEndValue + Math.round((this.endValue - this.initialEndValue) / this.stepValue) * this.stepValue ;

            // Check for case when the end value is under the start value
            if (parseFloat(this.startValue) > parseFloat(this.endValue)) {
                this.endValue = this.initialEndValue + Math.ceil((this.endValue - this.initialEndValue) / this.stepValue) * this.stepValue ;
            }

            // Check for case when the end value is over the maximum value
            if (parseFloat(this.endValue) > parseFloat(this.max)) {
                this.endValue = this.initialEndValue + Math.floor((this.max - this.initialEndValue) / this.stepValue) * this.stepValue ;
            }

            // Force end handle to redrawing
            this.handlers.End.redraw(this.range.calculateXFromValue(this.endValue), 0);
        }

        this.CDR.markForCheck();
        this.CDR.detectChanges();

    }

    ngAfterViewInit() {

        /**
         *   In case of ng2-slider is root component, @inputs would not work, so we check inputs - if they are not defined,
         *   get them as attributes
         */
        if (!this.min) this.min = this._elementRef.nativeElement.attributes.getNamedItem('min').value;
        if (!this.max) this.max = this._elementRef.nativeElement.attributes.getNamedItem('max').value;
        if (!this.startValue && this._elementRef.nativeElement.attributes.getNamedItem('value')) {
            this.startValue = this._elementRef.nativeElement.attributes.getNamedItem('value').value;
            if (this.startValue != null && this.endValue == null) this.isRange = false;
        }
        if (!this.startValue) this.startValue = this._elementRef.nativeElement.attributes.getNamedItem('startValue').value;
        if (!this.endValue && this.isRange) this.endValue = this._elementRef.nativeElement.attributes.getNamedItem('endValue').value;
        if (!this.stepValue && this._elementRef.nativeElement.attributes.getNamedItem('stepValue')) this.stepValue = this._elementRef.nativeElement.attributes.getNamedItem('stepValue').value;
        if (!this.stepValue) this.stepValue = 1;
        this.initialStartValue = parseFloat(this.startValue);
        this.initialEndValue = parseFloat(this.endValue);

        // If "id" was not set, create it randomly (8 signs)
        if (!this._elementRef.nativeElement.id) {
            this.id = Math.random().toString(36).slice(2, 10);
            this._elementRef.nativeElement.id = this.id;
        } else {
            this.id = this._elementRef.nativeElement.id
        }

        this.range = new Range({
            element: this.ribbon.nativeElement,
            min: this.min,
            max: this.max
        });

        this.stepX = this.range.calculateStepX(this.stepValue);

    }

    rangeChangedTrigger() {
        //this.rangeChangedEvent.emit({start: this.startValue, end: this.endValue});
        this.rangeChangedEvent.emit(this);
    }

    setStartValue(v) {
        this.startValue = v;
        this.valueChanged(RangeHandle.Start);
        this.CDR.detectChanges();
        this.CDR.markForCheck();
    }

    setEndValue(v) {
        this.endValue = v;
        this.valueChanged(RangeHandle.End);
        this.CDR.detectChanges();
        this.CDR.markForCheck();
    }

    onStopSliding(event: IEventSlideAble) {
        this.rangeChangedTrigger();
    }

    // Handling 'onsliding' event from SlideAbleDirective
    onSliding(event: IEventSlideAble) {
        var handle = RangeHandle.Both;
        if (event.elementId == this.id+'-left-handle') handle = RangeHandle.Start;
        if (event.elementId == this.id+'-right-handle') handle = RangeHandle.End;
        this.refreshInputBox(event.boundingRect, handle);
    }

    initHandlers(name: string, event: IEventSlideAble) {
        // Example of using callback function before redraw
        event.instance.checkXBeforeRedraw = function(x, y) {
            return true;
        }
        this.handlers[name] = event.instance;
        if (name == 'Start') this.valueChanged({}, RangeHandle.Start);
        if (name == 'End') this.valueChanged({}, RangeHandle.End);
    }
}


export class Range {

    private boundingRect:BoundingRectClass;

    constructor(private config:{element:any, min:any, max:any}) {
        if (typeof(this.config.min == 'string')) this.config.min = parseFloat(this.config.min);
        if (typeof(this.config.max == 'string')) this.config.max = parseFloat(this.config.max);
        this.boundingRect = config.element.getBoundingClientRect();
    }

    // Calculate relative handle position (percent) from value
    /**
     * Calculate relative handle position (percent) from value
     *
     * @param value
     * @returns {float}
     */
    calculatePercentFromValue(value:number) {
        return Math.round(100 * (value - this.config.min) / (this.config.max - this.config.min));
    }

    calculateXFromValue(value:number) {
        return  this.boundingRect.left +  Math.round((this.boundingRect.right - this.boundingRect.left) * (value - this.config.min) / (this.config.max - this.config.min));
    }

    // Calculate relative handle position (percent) from his position coordinate
    calculatePercentFromX(x:number) {
        return Math.round(100 * (x - this.boundingRect.left) / (this.boundingRect.right - this.boundingRect.left));
    }

    // Calculate value from handle position coordinate
    calculateValueFromX(x:number) {
        return this.config.min + Math.round((this.config.max - this.config.min) * (x - this.boundingRect.left) / (this.boundingRect.right - this.boundingRect.left));
    }

    calculateStepX(step) {
        return step * (this.boundingRect.right - this.boundingRect.left) / (this.config.max - this.config.min);
    }


    getLeftX() {
        return this.boundingRect.left;
    }

    getRightX() {
        return this.boundingRect.right;
    }

}