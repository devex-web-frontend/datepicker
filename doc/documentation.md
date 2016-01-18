## Classes

<dl>
<dt><a href="#Datepicker">Datepicker</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#Datepicker">Datepicker</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#getBlock">getBlock()</a> ⇒ <code>Node</code></dt>
<dd><p>Gets HTMLNode containing dropdown</p>
</dd>
<dt><a href="#getEventTarget">getEventTarget()</a> ⇒ <code>Node</code></dt>
<dd><p>Gets element which listens to events</p>
</dd>
<dt><a href="#setDateFormatter">setDateFormatter(customDateFormatter)</a></dt>
<dd><p>Sets custom date formatter</p>
</dd>
<dt><a href="#setDateParser">setDateParser(customDateParser)</a></dt>
<dd><p>Sets custom date parser</p>
</dd>
</dl>

<a name="Datepicker"></a>
## Datepicker
**Kind**: global class  

* [Datepicker](#Datepicker)
    * [new Datepicker(input, customConfig)](#new_Datepicker_new)
    * [.E_CREATED](#Datepicker.E_CREATED) : <code>string</code>
    * [.E_CHANGED](#Datepicker.E_CHANGED) : <code>string</code>
    * [.E_UPDATE_CONSTRAINTS](#Datepicker.E_UPDATE_CONSTRAINTS) : <code>string</code>

<a name="new_Datepicker_new"></a>
### new Datepicker(input, customConfig)
Creates new datepicker


| Param | Type |
| --- | --- |
| input | <code>Node</code> &#124; <code>Element</code> | 
| customConfig | <code>Object</code> | 

<a name="Datepicker.E_CREATED"></a>
### Datepicker.E_CREATED : <code>string</code>
**Kind**: static constant of <code>[Datepicker](#Datepicker)</code>  
**Default**: <code>&quot;datepicker:created&quot;</code>  
<a name="Datepicker.E_CHANGED"></a>
### Datepicker.E_CHANGED : <code>string</code>
**Kind**: static constant of <code>[Datepicker](#Datepicker)</code>  
**Default**: <code>&quot;datepicker:changed&quot;</code>  
<a name="Datepicker.E_UPDATE_CONSTRAINTS"></a>
### Datepicker.E_UPDATE_CONSTRAINTS : <code>string</code>
**Kind**: static constant of <code>[Datepicker](#Datepicker)</code>  
**Default**: <code>&quot;datepicker:updateconstraints&quot;</code>  
<a name="Datepicker"></a>
## Datepicker
**Kind**: global variable  
**Copyright**: Devexperts  

* [Datepicker](#Datepicker)
    * [new Datepicker(input, customConfig)](#new_Datepicker_new)
    * [.E_CREATED](#Datepicker.E_CREATED) : <code>string</code>
    * [.E_CHANGED](#Datepicker.E_CHANGED) : <code>string</code>
    * [.E_UPDATE_CONSTRAINTS](#Datepicker.E_UPDATE_CONSTRAINTS) : <code>string</code>

<a name="new_Datepicker_new"></a>
### new Datepicker(input, customConfig)
Creates new datepicker


| Param | Type |
| --- | --- |
| input | <code>Node</code> &#124; <code>Element</code> | 
| customConfig | <code>Object</code> | 

<a name="Datepicker.E_CREATED"></a>
### Datepicker.E_CREATED : <code>string</code>
**Kind**: static constant of <code>[Datepicker](#Datepicker)</code>  
**Default**: <code>&quot;datepicker:created&quot;</code>  
<a name="Datepicker.E_CHANGED"></a>
### Datepicker.E_CHANGED : <code>string</code>
**Kind**: static constant of <code>[Datepicker](#Datepicker)</code>  
**Default**: <code>&quot;datepicker:changed&quot;</code>  
<a name="Datepicker.E_UPDATE_CONSTRAINTS"></a>
### Datepicker.E_UPDATE_CONSTRAINTS : <code>string</code>
**Kind**: static constant of <code>[Datepicker](#Datepicker)</code>  
**Default**: <code>&quot;datepicker:updateconstraints&quot;</code>  
<a name="getBlock"></a>
## getBlock() ⇒ <code>Node</code>
Gets HTMLNode containing dropdown

**Kind**: global function  
<a name="getEventTarget"></a>
## getEventTarget() ⇒ <code>Node</code>
Gets element which listens to events

**Kind**: global function  
<a name="setDateFormatter"></a>
## setDateFormatter(customDateFormatter)
Sets custom date formatter

**Kind**: global function  

| Param | Type |
| --- | --- |
| customDateFormatter | <code>function</code> | 

<a name="setDateParser"></a>
## setDateParser(customDateParser)
Sets custom date parser

**Kind**: global function  

| Param | Type |
| --- | --- |
| customDateParser | <code>function</code> | 

