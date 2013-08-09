$.widget("jai.ipspinner", $.ui.spinner, {
 _parse: function(value){ return ( (typeof value === "string") ? ip2long(value) : value ); },
 _format: function(value){ return long2ip(value); }
});

$.widget("jai.maskspinner", $.ui.spinner, {
 options: { min: 8, max: 30 },
 _parse: function(value){ return ( (typeof value === "string") ? mask2cidr(value) : value ); },
 _format: function(value){ return cidr2mask(value); }
});

$.widget("jai.macspinner", $.ui.spinner, {// _create: function(){ $('#demo').html(what( this ,true)); this._super(); },
 _parse: function(value){ return ( (typeof value === "string") ? mac2long(value) : value ); },
 _format: function(value){ return long2mac(value); }
});

$.widget('jai.radioswitch', $.Widget, {
 _create: function(){
//  var opts = this.options; //.change;
  var eid = $(this.element).attr('id');
  $(this.element).change( this.options.change )
  $('<ul>').attr('id', eid +'radioSwitch').addClass('radioSwitch').append(this.element.children().map(function(i,e){
   return $('<li>')
    .html( $(e).text().trim() )
    .addClass('button')
    .attr('id', eid +'_'+ e.value )
    .data({ 'switchId': eid, 'switchValue': e.value })
    .click(function(event){ $(this).addClass('buttonSelected').siblings().removeClass('buttonSelected'); $('#'+$(this).data('switchId') ).val( $(this).data('switchValue') ).triggerHandler('change',[{ value: $(this).data('switchValue') }]); })
    .get();
  })).insertAfter(this.element);
  $('#'+eid +'_'+ this.options.value).triggerHandler('click');
  $(this.element).hide();
 }
});

$.widget( "ui.timespinner", $.ui.spinner, {
 options: {
  step: 60000, // 60 * 1000, // seconds
  page: 60 // hours
 },
 _parse: function(value){
  if( typeof value !== "string" ) return value;
  if( Number( value ) == value ) return Number( value );
  return +Globalize.parseDate( value );
 },
 _format: function(value){ return Globalize.format(new Date(value),'t'); }
});

$.widget( "jai.hidespinner", $.ui.spinner, {
 _parse: function(value){
//  if(typeof value ==="string"){}
  return value;
 },
 _format: function(value){
  return value;
//  return Globalize.format(new Date(value),'t');
 }
});

$.widget( "jai.editablelist", $.ui.sortable, {
 _create: function(){
  this.element.addClass('editableList');
  this.options.fid = this.element.attr('id');
  this.addItems(this.options.list);
  if(!this.options.fixed) $(this.element).after("<br><input type='button' value='Add' onclick='$(\"#"+ this.options.fid +"\").editablelist(\"addItems\")'>");
  this._super();
 },
 addItems: function(a){ if(a==null) a = false;
  var fid = this.options.fid;
  var fixed = this.options.fixed;
  $(this.element).append( $.map( ( a||[''] ),function(v,i){ return "<li><input class='editableFormComplement' type='hidden' name='"+ fid +"[]' value='"+ v +"'><span class='editableListText'>"+ v +"</span>"+(fixed?'':"<a class='deleteX'>X</a>")+"</li>"; }) );
  if(!fixed) $(this.element).find('.deleteX').click(function(event){ $(event.target).parent().remove(); });
  $(this.element).find('.editableListText').editable(function(value, settings){
    if(!fixed) if(value==''){ $(this).parent().remove(); };
    $(this).siblings('.editableFormComplement').val(value);
    return value;
   },{ 'onblur': 'submit', 'event': 'dblclick', placeholder: '(Double click to edit.)' }
  );
  if($(this.element).data('sortable')) $(this.element).sortable('refresh');
  if(!a) $(this.element).last().children().last().children('.editableListText').trigger('dblclick');
 },
 options: {
  forcePlaceholderSize: true,
  forceHelperSize: true,
  placeholder: "editableListPlaceholder",
  items: "li:not(.listBookend)",
 }
});

/* END Editable List Widget Junk*/
