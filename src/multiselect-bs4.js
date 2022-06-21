/**
 * Multiselect for bootstrap 4
 *
 * https://github.com/lesilent/multiselect-bs4
 */
(function () {
//-------------------------------------
'use strict';

/**
 * Default options for the current modal being displayed
 *
 * @type {object}
 * @todo add support for additional options
 */
var settings = {
	collapseOptGroupsByDefault: true,
	enableCaseInsensitiveFiltering: true,
	enableCollapsibleOptGroups: true,
	includeSelectAllOptionMin: 10, // Minimum number of options to automatically enable includeSelectAllOption
//	maxHeight: '20rem',
	minScreenWidth: 576,
	selectAllDeselectAll: false,  // Deselect all if All is selected
	selectAllText: 'All',
	selectAllValue: ''
};

/**
 * Flag for whether plugin has been initialized
 *
 * @type {boolean}
 */
var initialized = false;

/**
 * Convert special chararacters html entities
 *
 * @param  {str} the string to encode
 * @return {str} the encoded string
 */
function htmlEncode(str)
{
	return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

/**
 * Add method for initializing plugin
 */
jQuery.fn.multiselect = function (options) {
	// Get boostrap version
	var bs_version = parseInt(jQuery.fn.dropdown.Constructor.VERSION.replace(/\..+$/, ''));
	if (bs_version < 4)
	{
		console.error('Invalid bootstrap version ' + bs_version + ' detected');
	}

	// Initialize code if it hasn't already
	if (!initialized)
	{
		initialized = true;
		jQuery(document.head).append('<style id="multiselect-style">'
			+ '.caret { display: inline-block; width:0; height:0; margin-left:2px; vertical-align:middle; border-top:4px solid; border-right:4px solid transparent; border-left:4px solid transparent; }'
			+ '</style>');
	}

	// Process options
	if (typeof options == 'undefined')
	{
		options = {};
	}
	var common_options = jQuery.extend({}, settings, options);

	// Return if screen doesn't meet the mininum width
	if (common_options.minScreenWidth && window.screen.width < common_options.minScreenWidth)
	{
		return this;
	}

	// Initialize the inputs
	return this.each(function () {
		var $select = jQuery(this);
		var select_id = this.id || 'select-' + Math.floor(Math.random() * 1000000 + 1);
		if (!this.id)
		{
			this.id = select_id;
		}
		var select_options = jQuery.extend(true, {}, common_options);

		// Add dropdown html
		var select_length = $select.find('option').length;
		var selected_count = 0;
		var selected_text = [];
		var separator = ', ';
		$select.find('option:selected').each(function () {
			selected_count++;
			if (selected_count < 10)
			{
				selected_text.push(this.innerText);
				if (separator == ', ' && this.innerText.indexOf(',') >= 0)
				{
					separator = '; ';
				}
			}
		});
		var max_height = ($select.offset().top > 0)
			? Math.max(window.innerHeight - Math.ceil($select.offset().top) - 48, 320) + 'px'
			: '20rem';
		var display = ($select.offsetParent().position().top > 320) ? 'dynamic' : 'static';
		var $label = jQuery('label[for="' + select_id + '"]');
		var html = '<div class="btn-group btn-block dropdown d-print-none' + (select_options.dropUp ? ' dropup' : '') + (select_options.dropRight ? ' dropright' : '' ) + '">'
			+ '<button type="button" id="' + select_id + '-dropdown-btn" class="btn btn-outline-secondary btn-block overflow-hidden dropdown-toggle ' + ((selected_count > 0) ? 'active bg-secondary text-white' : 'bg-white text-dark') + '" data-toggle="dropdown" data-boundary="window" data-display="' + display + '" aria-haspopup="true" aria-expanded="false" aria-pressed="' + ((selected_count > 0) ? 'true' : 'false') + '" ' + (this.disabled ? 'disabled="disabled"' : '') + ' style="border-top-right-radius:0; border-bottom-right-radius:0;">'
			+ (($label.hasClass('sr-only') || $label.hasClass('invisible') || $label.hasClass('hidden') || $label.prop('hidden')) ? ($label.html().replace(/\s*:$/, '') || '') : '')
			+ '<div class="d-inline-flex justify-content-center align-items-center" style="max-width:calc(100% - 2rem)">'
			+ '&nbsp;<div id="' + select_id + '-dropdown-text" class="text-truncate"' + (selected_count > 0 ? '' : ' hidden="hidden"') + '>' + selected_text.join(separator) + '</div>'
			+ '&nbsp;<div id="' + select_id + '-dropdown-badge" class="badge badge-light" ' + (selected_count > 1 ? '' : 'hidden="hidden"') + '>' + selected_count + '</div>'
			+ '</div>'
			+ '</button>'
			+ '<div id="' + select_id + '-dropdown-menu" class="dropdown-menu overflow-auto w-100'
			+ (($select.offset().left > window.innerWidth / 2) ? ' dropdown-menu-right' : '')
			+ '" aria-labelledby="' + select_id + '-dropdown-btn" style="overflow-y:scroll; max-height:' + max_height + ';">';
		if (select_options.enableFiltering)
		{
			html += '<div class="dropdown-item-text px-2"><div class="input-group">'
				+ '<div class="input-group-prepend"><span id="' + select_id + '-search" class="input-group-text"><i class="fas fa-search"></i></div>'
				+ '<input type="text" id="' + select_id + '-search-input" class="form-control" autocomplete="off" aria-describedby="' + select_id + '-search" />'
				+ '<div class="input-group-append"><button type="button" id="' + select_id + '-search-reset" class="btn btn-outline-secondary"><i class="far fa-times-circle"></i></button></div>'
				+ '</div></div>';
		}
		if (select_options.includeSelectAllOption || (select_options.includeSelectAllOptionMin !== false && $select.children('option').length >= select_options.includeSelectAllOptionMin))
		{
			html += '<div id="' + select_id + '-dropdown-item-all" class="dropdown-item-text text-nowrap px-2">'
				+ '<label class="mb-0 d-block" for="' + select_id + '-dropdown-checkbox-all">'
				+ '<input type="checkbox" id="' + select_id + '-dropdown-checkbox-all" class="dropdown-checkbox" value="' + htmlEncode(select_options.selectAllValue) + '" ' + ((selected_count == select_length) ? 'checked="checked"' : '') + ' disabled="disabled" autocomplete="off" /> '
				+ htmlEncode(select_options.selectAllText) + '</label></div>';
		}

		// Add dropdown items
		var i = 1;
		$select.children('option,optgroup').each(function () {
			if (this.tagName.toLowerCase() == 'optgroup')
			{
				var collapse_id = select_id + '-dropdown-collapse-' + i;
				if (select_options.enableCollapsibleOptGroups)
				{
					html += '<div class="border"><div class="dropdown-item-text px-2 collapse-toggle">'
						+ '<a class="collapse-toggle text-body d-block font-weight-bolder" href="javascript:void(0)" role="button" data-toggle="collapse" aria-expanded="false" aria-controls="' + collapse_id + '">' + htmlEncode(this.label) + ' <i class="caret"></i></a>'
						+ '</div>'
						+ '<div id="' + collapse_id + '" class="' + (select_options.collapseOptGroupsByDefault ? 'collapse' : '') + '">';
				}
				jQuery(this).children('option').each(function () {
					html += '<div id="' + select_id + '-dropdown-item-' + i + '" class="dropdown-item-text text-nowrap px-2 ' + select_id + '-dropdown-item">'
						+ '<label class="mb-0 d-block" for="' + select_id + '-dropdown-checkbox-' + i + '">'
						+ '<input type="checkbox" id="' + select_id + '-dropdown-checkbox-' + i + '" class="dropdown-checkbox" value="' + htmlEncode(this.value) + '" data-offset="' + i + '" ' + (this.selected ? 'checked="checked"' : '') + ' autocomplete="off" /> '
						+ htmlEncode(this.text) + '</label></div>';
					i++;
				});
				if (select_options.enableCollapsibleOptGroups)
				{
					html += '</div></div>';
				}
			}
			else
			{
				html += '<div id="' + select_id + '-dropdown-item-' + i + '" class="dropdown-item-text text-nowrap px-2 ' + select_id + '-dropdown-item">'
					+ '<label class="mb-0 d-block" for="' + select_id + '-dropdown-checkbox-' + i + '">'
					+ '<input type="checkbox" id="' + select_id + '-dropdown-checkbox-' + i + '" class="dropdown-checkbox" value="' + htmlEncode(this.value) + '" data-offset="' + i + '" ' + (this.selected ? 'checked="checked"' : '') + ' autocomplete="off" /> '
					+ htmlEncode(this.text) + '</label></div>';
				i++;
			}
		});
		html += '</div>'
			+ '<button type="button" id="' + select_id + '-reset-btn" class="btn btn-outline-secondary bg-white text-secondary"' + ((this.disabled || selected_count < 1) ? ' disabled="disabled"' : '') + '><i class="far fa-times-circle"></i></button>'
			+ '</div>';
		$select.toggleClass('d-none', true).after(html);

		// Stop clicks from closing dropdown and other event handlers
		var $dropdown = jQuery('#' + select_id + '-dropdown-menu').on('click', function (e) {
			e.stopPropagation();
		});
		var $allbox = jQuery('#' + select_id + '-dropdown-checkbox-all');
		$dropdown.find('input.dropdown-checkbox').on('click', function (e) {
			var offset = jQuery(this).data('offset');
			if (offset > 0)
			{
				if ($allbox.length > 0 && !this.checked && $allbox.prop('checked') && !(select_options.enableFiltering && document.getElementById(select_id + '-search-input').value.length > 0))
				{
					// If unchecking a box when all is checked, then select all other options
					$select.find('option').prop('selected', true);
				}
				$select.find('option').eq(offset - 1).prop('selected', this.checked);
				selected_count = $select.find('option:selected').length;
				jQuery('#' + select_id + '-dropdown-badge').text(selected_count).prop('hidden', selected_count < 1);
				$select.trigger('change');
			}
		});
		$allbox.on('click', function () {
			if (this.checked && select_options.enableFiltering && document.getElementById(select_id + '-search-input').value.length > 0)
			{
				// Handle when all is checked with filtering
				var $checkboxes = $dropdown.find('.' + select_id + '-dropdown-item:not(.d-none)').find('.dropdown-checkbox');
				$checkboxes.prop('checked', true).each(function () {
					var offset = jQuery(this).data('offset');
					$select.find('option').eq(offset - 1).prop('selected', true);
				});
				jQuery('#' + select_id + '-dropdown-badge').text($checkboxes.length).prop('hidden', $checkboxes.length == 0);
			}
			else
			{
				$dropdown.find('input.dropdown-checkbox').prop('checked', this.checked);
				jQuery('#' + select_id + '-dropdown-badge').text(this.checked ? select_length : 0).prop('hidden', !this.checked);
				$select.find('option').prop('selected', this.checked && !select_options.selectAllDeselectAll);
			}
		}).prop('disabled', false);
		if (select_options.enableCollapsibleOptGroups)
		{
			$dropdown.find('.collapse-toggle').on('click', function () {
				jQuery('#' + this.getAttribute('aria-controls')).collapse('toggle');
			});
		}
		if (select_options.enableFiltering)
		{
			jQuery('#' + select_id + '-search-reset').on('click', function () {
				document.getElementById(select_id + '-search-input').value = '';
				$dropdown.find('.' + select_id + '-dropdown-item').toggleClass('d-none', false);
			});
			jQuery('#' + select_id + '-search-input').on('keyup', function (e) {
				var search_text = this.value.replace(/^\s+|\s+$/g, '');
				if (select_options.enableCaseInsensitiveFiltering)
				{
					search_text = search_text.toLowerCase();
				}
				if (search_text.length > 0)
				{
					$dropdown.find('.' + select_id + '-dropdown-item').each(function () {
						var $item = jQuery(this);
						var label_text = $item.text();
						$item.toggleClass('d-none', (select_options.enableCaseInsensitiveFiltering
							? label_text.toLowerCase().indexOf(search_text)
							: label_text.indexOf(search_text)) < 0);
					});
				}
				else
				{
					$dropdown.find('.' + select_id + '-dropdown-item').toggleClass('d-none', false);
				}
			}).prop('disabled', false);
		}

		// Add event handler so changes be propagated to dropdown
		$select.on('change', function () {
			$dropdown.find('input.dropdown-checkbox').prop('checked', false);
			selected_count = 0;
			selected_text = [];
			separator = ', ';
			$select.find('option').each(function () {
				$dropdown.find('input.dropdown-checkbox[value="' + this.value + '"]').prop({
					disabled: this.disabled,
					checked: this.selected
				});
				if (this.selected)
				{
					selected_count++;
					if (selected_count < 10)
					{
						selected_text.push(this.innerText);
						if (separator == ', ' && this.innerText.indexOf(',') >= 0)
						{
							separator = '; ';
						}
					}
				}
			});
			jQuery('#' + select_id + '-dropdown-text').text(selected_text.join(separator)).prop('hidden', selected_count < 1);
			jQuery('#' + select_id + '-dropdown-badge').text(selected_count).prop('hidden', selected_count < 2);
			jQuery('#' + select_id + '-dropdown-btn').toggleClass(['active', 'bg-secondary', 'text-white'], selected_count > 0).toggleClass(['bg-white', 'text-dark'], selected_count < 1).attr('aria-pressed', selected_count > 0);
			jQuery('#' + select_id + '-reset-btn').prop('disabled', selected_count < 1);
			if (selected_count == select_length)
			{
				$allbox.prop('checked', true);
			}
		});

		jQuery('#' + select_id + '-reset-btn').on('click', function () {
			$select.find('option:selected:not(:disabled)').prop('selected', false);
			$dropdown.find('input.dropdown-checkbox').prop('checked', false);
			jQuery('#' + select_id + '-dropdown-badge').text(0).prop('hidden', true);
			jQuery('#' + select_id + '-dropdown-btn').toggleClass(['active', 'bg-secondary', 'text-white'], false).toggleClass(['bg-white', 'text-dark'], true).attr('aria-pressed', false);
			this.disabled = true;
			$select.trigger('change');
		});

		// Trigger change on page show so that drop down gets updated when back button gets pressed
		jQuery(window).on('pageshow', function () {
			$select.trigger('change');
		});
	});
};

//-------------------------------------
}());
