/**
 * Multiselect for Bootstrap 4
 *
 * https://github.com/lesilent/multiselect-bs4
 */
(function () {
//-------------------------------------
'use strict';

/**
 * Flag for whether plugin has been initialized
 *
 * @type {boolean}
 */
let initialized = false;

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
 * Update the selector
 *
 * @param {object} $select the select object input
 */
function updateSelect($select)
{
	const prefix = $select.data('prefix');
	const multiple = $select[0].multiple;
	const options = $select.data('options');
	const selected_limit = 30;
	let selected_count = 0;
	let selected_text = [];
	let separator = null;
	let all_selected = multiple ? true : false;
	const itype = multiple ? 'checkbox' : 'radio';
	let i = 1;
	$select.children('option,optgroup').each(function () {
		const disabled = this.disabled;
		const hidden = this.hidden;
		if (this.tagName.toLowerCase() == 'optgroup')
		{
			const $optgroup = jQuery(this);
			const $options = $optgroup.children('option');
			const $optinput = jQuery('#' + prefix + '-dropdown-optgroup-' + itype + '-' + i);
			let optchecked = null;
			jQuery('#' + prefix + '-dropdown-toggle-' + i).toggleClass('border-top border-bottom', !hidden).children('.dropdown-item-text').prop('hidden', hidden);
			$options.each(function () {
				const $option = jQuery(this);
				if (multiple)
				{
					if (options.selectAllDeselectAll && $option.data('selected'))
					{
						this.selected = true;
					}
					if (!this.selected && !(this.disabled || disabled))
					{
						all_selected = false;
						optchecked = false;
					}
				}
				jQuery('#' + prefix + '-dropdown-item-' + i).prop('hidden', hidden || this.hidden).find('label').toggleClass('text-muted', this.disabled || disabled).find('#' + prefix + '-dropdown-' + itype + '-' + i).prop('checked', this.selected).prop('disabled', this.disabled || disabled);
				if (this.selected)
				{
					if (optchecked === null)
					{
						optchecked = true;
					}
					selected_count++;
					if (selected_count < selected_limit)
					{
						if (separator === null && this.innerText.indexOf(',') >= 0)
						{
							separator = '; ';
						}
						selected_text.push(this.innerText);
					}
				}
				i++;
			});
			$optinput.prop('checked', optchecked === true).prop('disabled', disabled);
		}
		else
		{
			const $option = jQuery(this);
			if (multiple)
			{
				if (options.selectAllDeselectAll && $option.data('selected'))
				{
					this.selected = true;
				}
				if (all_selected && !this.selected && !disabled)
				{
					all_selected = false;
				}
			}
			jQuery('#' + prefix + '-dropdown-item-' + i).prop('hidden', hidden).find('label').toggleClass('text-muted', this.disabled).find('#' + prefix + '-dropdown-' + itype + '-' + i).prop('checked', this.selected).prop('disabled', disabled);
			if (this.selected)
			{
				selected_count++;
				if (selected_count < selected_limit)
				{
					if (separator === null && this.innerText.indexOf(',') >= 0)
					{
						separator = '; ';
					}
					selected_text.push(this.innerText);
				}
			}
			i++;
		}
	});

	const active = (multiple && selected_count > 0) || (!multiple && ($select[0].selectedIndex > 0 || $select[0].value.length > 0));
	const disabled = $select.prop('disabled');
	jQuery('#' + prefix + '-dropdown-checkbox-all').prop('checked', all_selected);
	jQuery('#' + prefix + '-dropdown-label').prop('hidden', active);
	jQuery('#' + prefix + '-dropdown-text').text((all_selected && options.selectAllDeselectAll) ? options.selectAllText : selected_text.join(separator || ', ')).prop('hidden', !active);
	jQuery('#' + prefix + '-dropdown-badge').text(selected_count).prop('hidden', selected_count < 2);
	jQuery('#' + prefix + '-dropdown-btn').toggleClass(['active', 'bg-secondary', 'text-white'], active).toggleClass(['bg-white', 'text-dark'], !active).attr('aria-pressed', active).prop('disabled', disabled);
	jQuery('#' + prefix + '-reset-btn').prop('disabled', disabled || !active || (!multiple && $select[0].selectedIndex < 1));
	if (multiple && options.selectAllDeselectAll && all_selected)
	{
		$select.find('option:selected').prop('selected', false);
	}
}

/**
 * Add method for initializing plugin
 */
jQuery.fn.multiselect = function (options) {
	// Get boostrap version
	const bs_version = parseInt(((typeof bootstrap == 'object') ? bootstrap.Dropdown.VERSION : jQuery.fn.dropdown.Constructor.VERSION || '0').replace(/\..+$/, ''));
	if (bs_version < 4)
	{
		console.error('Invalid bootstrap version ' + bs_version + ' detected');
	}

	// Handle functions
	if (typeof options == 'string' || typeof options == 'boolean')
	{
		if (this.length < 1)
		{
			return undefined;
		}
		const single_arg = (arguments.length == 1);
		let options_type = false;
		let options_value = single_arg ? undefined : arguments[1];
		switch (options)
		{
			case 'dispose':
				jQuery('#' + this.data('prefix') + '-multiselect-div').remove();
				this.data('options', null).data('multiselect', null).removeClass('d-none multiselect').find('option').data('selected', null);
				break;
			case 'reset':
				this.find('option').data('selected', false).prop('selected', false);
				this.trigger('change');
				break;
			case 'collapseOptGroupsByDefault':
			case 'enableCaseSensitiveFiltering':
			case 'enableCollapsibleOptGroups':
			case 'enableFiltering':
			case 'includeSelectAllOption':
			case 'selectAllDeselectAll':
				options_type = 'boolean';
				break;
			case 'includeSelectAllOptionMin':
				options_type = 'number';
				if (!single_arg)
				{
					if (parseInt(options_value) > 0)
					{
						options_value = parseInt(options_value);
					}
					else
					{
						console.warn('Invalid ' + options);
					}
				}
				break;
			case 'dropDirection':
			case 'selectAllText':
			case 'selectAllValue':
				options_type = 'string';
				break;
			default:
				break;
		}
		if (options_type)
		{
			let select_options = this.data('options') || {};
			if (single_arg)
			{
				return select_options[options];
			}
			else if (typeof options_value == options_type)
			{
				if (options == 'dropDirection' && !['down','left','right','up'].includes(options_value))
				{
					console.warn('Invalid dropDirection value');
					return this;
				}
				select_options[options] = options_value;
				this.data('options', select_options);
			}
			else
			{
				console.warn('Invalid ' + options);
			}
		}
		return this;
	}

	// Initialize code if it hasn't already
	if (!initialized)
	{
		initialized = true;
		jQuery(document.head).append('<style id="multiselect-bs4-style">'
			+ '.dropdown-group-radio { accent-color: currentColor; }'
			+ '.caret { display: inline-block; width:0; height:0; margin-left:5px; margin-right:5px; vertical-align:middle; border-top:4px solid; border-right:4px solid transparent; border-left:4px solid transparent; }'
			+ '</style>');
	}

	// Set up javascript options
	if (typeof options == 'undefined')
	{
		options = {};
	}
	const common_options = jQuery.extend({}, jQuery.fn.multiselect.defaults, options);

	// Initialize the inputs
	const $body = jQuery('body');
	return this.each(function () {
		const select_rand = Math.floor(Math.random() * 1000000 + 1);
		const $select = jQuery(this);

		// Get select id
		let prefix = this.id;
		if (this.id)
		{
			prefix += '-' + select_rand;
		}
		else
		{
			prefix = 'select-' + select_rand;
			this.id = prefix;
		}
		$select.data('prefix', prefix);
		const multiple = this.multiple;

		// Process options
		let select_options = jQuery.extend(true, {}, common_options);
		for (const option in jQuery.fn.multiselect.defaults)
		{
			let option_value = $select.data(option);
			if (typeof option_value != 'undefined' && !(option == 'selectAllText' && !option_value))
			{
				if (option == 'includeSelectAllOptionMin')
				{
					option_value = (typeof option_value == 'string' && option_value.length < 1) ? false : parseInt(option_value);
				}
				select_options[option] = option_value;
			}
		}
		$select.data('options', select_options);

		// Add dropdown html
		const size = parseInt($select.attr('size') || 0);
		let max_height = ($select.offset().top > 0)
			? Math.max(window.innerHeight - Math.ceil($select.offset().top) - 48, (size > 1) ? ((size - 1) * 32) : 320) + 'px'
			: '20rem';
		let html = '<div id="' + prefix + '-multiselect-div" class="btn-group btn-block d-print-none drop' + (select_options.dropDirection) + '">'
			+ '<button type="button" id="' + prefix + '-dropdown-btn" class="btn btn-outline-secondary btn-block overflow-hidden dropdown-toggle bg-white text-dark" data-toggle="dropdown" data-boundary="window"' + (($select.offset().top < 320) ? ' data-flip="false"' : '') + ' aria-haspopup="true" aria-expanded="false" aria-pressed="false"' + (this.disabled ? ' disabled="disabled"' : '') + ' style="border-top-right-radius:0; border-bottom-right-radius:0;">'
			//+ '<div id="' + prefix + '-dropdown-label" class="text-truncate"></div>'
			+ '<div class="d-inline-flex justify-content-center align-items-center" style="max-width:calc(100% - 2rem)">'
			+ '&nbsp;<div id="' + prefix + '-dropdown-label" class="text-truncate"></div>'
			+ '&nbsp;<div id="' + prefix + '-dropdown-text" class="text-truncate" hidden="hidden"></div>'
			+ '&nbsp;<div id="' + prefix + '-dropdown-badge" class="badge badge-light" hidden="hidden"></div>'
			+ '</div>'
			+ '</button>'
			+ '<div id="' + prefix + '-dropdown-menu" class="dropdown-menu overflow-auto py-0 w-100'
			+ (($select.offset().left > window.innerWidth - 300) ? ' dropdown-menu-right' : '')
			+ '" aria-labelledby="' + prefix + '-dropdown-btn" style="overflow-y:scroll; max-height:' + max_height + ';">';
		if (select_options.enableFiltering)
		{
			html += '<div class="dropdown-item-text px-2"><div class="input-group">'
				+ '<div class="input-group-prepend"><span id="' + prefix + '-search" class="input-group-text"><i class="fas fa-search"></i></span></div>'
				+ '<input type="text" id="' + prefix + '-search-input" class="form-control" autocomplete="off" aria-describedby="' + prefix + '-search" />'
				+ '<div class="input-group-append"><button type="button" id="' + prefix + '-search-reset" class="btn btn-outline-secondary" disabled="disabled"><i class="far fa-times-circle"></i></button></div>'
				+ '</div></div>';
		}
		if (multiple && select_options.includeSelectAllOption && (!select_options.includeSelectAllOptionMin || this.options.length >= select_options.includeSelectAllOptionMin))
		{
			html += '<div id="' + prefix + '-dropdown-item-all" class="dropdown-item-text text-nowrap px-2">'
				+ '<label class="mb-0 text-truncate d-block" for="' + prefix + '-dropdown-checkbox-all">'
				+ '<input type="checkbox" id="' + prefix + '-dropdown-checkbox-all" class="dropdown-checkbox-all" value="" disabled="disabled" autocomplete="off" />'
				+ ' <span id="' + prefix + '-dropdown-checkbox-all-label"></span></label></div>';
		}

		// Add dropdown items
		const itype = multiple ? 'checkbox' : 'radio';
		let first_option_blank = null;
		let update = false;
		let i = 1;
		$select.children('option,optgroup').each(function () {
			const disabled = this.disabled;
			const hidden = this.hidden;
			let input_id;
			if (this.tagName.toLowerCase() == 'optgroup')
			{
				const $optgroup = jQuery(this);
				const $options = $optgroup.children('option');
				const options_length = $options.length;
				const optgroup_i = i;
				const end_i = i + options_length - 1;
				const collapse_id = prefix + '-dropdown-collapse-' + i;
				input_id = prefix + '-dropdown-optgroup-' + itype + '-' + i;
				html += '<div id="' + prefix + '-dropdown-toggle-' + i + '" class="' + (hidden ? '' : 'border-top border-bottom ') + prefix + '-dropdown-toggle"><div class="dropdown-item-text px-2 text-nowrap' + (select_options.enableCollapsibleOptGroups ? ' collapse-toggle' : '') + '"' + (hidden ? 'hidden="hidden"' : '') + '>'
					+ '<label class="mb-0 font-weight-bolder user-select-none' + (select_options.enableCollapsibleOptGroups ? '' : ' d-block') + '' + (disabled ? ' text-muted' : '') + '" for="' + input_id + '">'
					+ '<input type="' + itype + '" id="' + input_id + '" class="' + ((options_length > 0) ? 'dropdown-group-' + itype : '') + ((disabled || options_length < 1) ? ' disabled' : '') + '"' + (multiple ? '' : ' name="' + prefix + '_"') + ((options_length > 0 && $options.filter(':selected').length == options_length) ? ' checked="checked"' : '') + ((disabled || options_length < 1) ? ' disabled="disabled"' : '') + ((multiple || select_options.enableCollapsibleOptGroups) ? '' : ' hidden="hidden"') + ' data-offset="[' + i + ',' + end_i + ']" aria-controls="' + collapse_id + '" /> '
					+ htmlEncode(this.label) + '</label>'
					+ ((select_options.enableCollapsibleOptGroups && options_length > 0) ? '<a class="collapse-toggle d-inline-block text-body w-100" href="javascript:void(0)" role="button" data-toggle="collapse" aria-expanded="false" aria-controls="' + collapse_id + '"><i class="caret"></i></a>' : '')
					+ '</div>'
					+ '<div id="' + collapse_id + '" class="collapse' + ((select_options.enableCollapsibleOptGroups && (select_options.collapseOptGroupsByDefault || $optgroup.data('collapsed'))) ? '' : ' show') + '">';
				/*
				if (select_options.enableCollapsibleOptGroups && options_length > 0)
				{
					html += '<div class="border-top border-bottom"><div class="dropdown-item-text px-2 text-nowrap collapse-toggle">'
						+ '<label class="mb-0 d-inline-block font-weight-bolder' + (disabled ? ' text-muted' : '') + '" for="' + input_id + '">'
						+ '<input type="checkbox" id="' + input_id + '" class="dropdown-group-checkbox"' + (($options.filter(':selected').length == options_length) ? ' checked="checked"' : '') + (disabled ? ' disabled="disabled"' : '') + ' data-offset="[' + i + ',' + end_i + ']" /> '
						+ htmlEncode(this.label) + '</label>'
						+ '<a class="collapse-toggle text-body" href="javascript:void(0)" role="button" data-toggle="collapse" aria-expanded="false" aria-controls="' + collapse_id + '"><i class="caret"></i></a>'
						+ '</div>'
						+ '<div id="' + collapse_id + '" class="collapse' + (select_options.collapseOptGroupsByDefault ? '' : ' show') + '">';
				}
				else
				{
					html += '<div class="border-top border-bottom"><div class="dropdown-item-text px-2 text-nowrap">'
						+ '<label class="mb-0 d-inline-block font-weight-bolder' + (disabled ? ' text-muted' : '') + '" for="' + input_id + '">'
						+ '<input type="checkbox" id="' + input_id + '" class="d-none" ' + (disabled ? ' disabled="disabled"' : '') + ' /> '
						+ htmlEncode(this.label) + '</label>'
						+ '</div>'
						+ '<div id="' + collapse_id + '" class="collapse1 show">';
				}
				*/
				$options.each(function () {
					const opt_disabled = (disabled || this.disabled);
					const opt_hidden = (hidden || this.hidden);
					input_id = prefix + '-dropdown-' + itype + '-' + i;
					html += '<div id="' + prefix + '-dropdown-item-' + i + '" class="dropdown-item-text text-nowrap px-2 ' + prefix + '-dropdown-item"' + (opt_hidden ? ' hidden="hidden"' : '') + '>'
						+ '<label class="mb-0 d-block pl-3 user-select-none' + (opt_disabled ? ' text-muted' : '') + '" for="' + input_id + '">'
						+ '<input type="' + itype + '" id="' + input_id + '" class="dropdown-' + itype + (opt_disabled ? ' disabled' : '') + '"' + (multiple ? '' : ' name="' + prefix + '"') + ' value="' + htmlEncode(this.value) + '" data-offset="' + i + '" data-optgroup="' + optgroup_i + '"' + (this.selected ? ' checked="checked"' : '') + (opt_disabled ? ' disabled="disabled"' : '') + ' autocomplete="off" /> '
						+ htmlEncode(this.text) + '</label></div>';
					if (first_option_blank === null && !opt_disabled &&  this.value === '')
					{
						first_option_blank = true;
					}
					if (this.selected)
					{
						update = true;
					}
					i++;
				});
				html += '</div></div>';
			}
			else
			{
				input_id = prefix + '-dropdown-' + itype + '-' + i;
				html += '<div id="' + prefix + '-dropdown-item-' + i + '" class="dropdown-item-text text-nowrap px-2 ' + prefix + '-dropdown-item"' + (hidden ? ' hidden="hidden"' : '') + '>'
					+ '<label class="mb-0 d-block user-select-none' + (disabled ? ' text-muted' : '') + '" for="' + input_id + '">'
					+ '<input type="' + itype + '" id="' + input_id + '" class="dropdown-' + itype + (disabled ? ' disabled' : '') + '"' + (multiple ? '' : ' name="' + prefix + '"') + ' value="' + htmlEncode(this.value) + '" data-offset="' + i + '"' + (this.selected ? ' checked="checked"' : '') + (disabled ? ' disabled="disabled"' : '') + ' autocomplete="off" /> '
					+ htmlEncode(this.text) + '</label></div>';
				if (this.selected)
				{
					update = true;
				}
				i++;
			}
		});
		html += '</div>'
			+ '<button type="button" id="' + prefix + '-reset-btn" class="btn btn-outline-secondary bg-white text-secondary" disabled="disabled"><i class="far fa-times-circle"></i></button>'
			+ '</div>';
		if ($select.data('multiselect'))
		{
			// If multiselect is already initialized, then update html and select
			jQuery('#' + prefix + '-multiselect-div').replaceWith(html);
			update = true;
		}
		else
		{
			$select.data('multiselect', true).addClass('d-none multiselect').after(html);
		}

		// Update dropdown label
		const $dropdown = jQuery('#' + prefix + '-multiselect-div');
		const $label = jQuery('label[for="' + prefix + '"]');
		if ($label.length > 0 && ($label.hasClass('sr-only') || $label.hasClass('d-none') || $label.hasClass('invisible') || $label.prop('hidden') || $label.css('display') == 'none' || $label.css('visibility') == 'hidden'))
		{
			$dropdown.find('#' + prefix + '-dropdown-label').html($label.html().replace(/\s*:$/, ''));
		}

		// Stop clicks from closing dropdown and other event handlers
		const $dropdown_menu = $dropdown.find('#' + prefix + '-dropdown-menu').on('click', (e) => e.stopPropagation());

		// Add event handlers
		const $dropdown_btn = jQuery('#' + prefix + '-dropdown-btn').on('click', () => $dropdown_btn.removeClass('border-danger'));

		let submit_func;
		if (multiple)
		{
			$dropdown.find('input.dropdown-group-checkbox').on('click', function () {
				const checked = this.checked;
				const offsets = jQuery(this).data('offset');
				$select.find('option').slice(offsets[0] - 1, offsets[1]).not(':disabled').data('selected', this.checked).prop('selected', this.checked);
				$select.trigger('change');
			//	this.checked = checked;
			});
			$dropdown.find('input.dropdown-checkbox').on('click', function () {
				const offset = jQuery(this).data('offset');
				if (offset > 0)
				{
					const optgroup = jQuery(this).data('optgroup');
					if (optgroup > 0)
					{
						const checked = this.checked ? (jQuery('#' + prefix + '-dropdown-collapse-' + optgroup).find('input.dropdown-checkbox:not(:checked)').length < 1) : false;
						jQuery('#' + prefix + '-dropdown-optgroup-checkbox-' + optgroup).prop('checked', checked);
					}
					$select.find('option').eq(offset - 1).not(':disabled').data('selected', this.checked).prop('selected', this.checked);
					$select.trigger('change');
				}
			});
			$dropdown.find('#' + prefix + '-dropdown-checkbox-all').on('click', function () {
				if (this.checked && select_options.enableFiltering && document.getElementById(prefix + '-search-input').value.length > 0)
				{
					// Handle when all is checked with filtering
					$dropdown.find('.' + prefix + '-dropdown-item:not(.d-none)').find('.dropdown-checkbox:not([disabled]').prop('checked', true).each(function () {
						$select.find('option').eq(jQuery(this).data('offset') - 1).not(':disabled').data('selected', true).prop('selected', true);
					});
				}
				else
				{
					$dropdown.find('input.dropdown-checkbox:not([disabled]), input.dropdown-group-checkbox:not([disabled])').prop('checked', this.checked);
					$select.find('option:not([disabled])').data('selected', this.checked).prop('selected', this.checked && !select_options.selectAllDeselectAll);
				}
				$select.trigger('change');
			}).val(select_options.selectAllValue).prop('disabled', false);
			$dropdown.find('#' + prefix + '-dropdown-checkbox-all-label').text(select_options.selectAllText);
			submit_func = function () {
				const empty = ($select.find('option:selected').length < 1);
				$dropdown_btn.toggleClass('border-danger', empty);
				if (empty)
				{
					return false;
				}
			};
		}
		else
		{
			$dropdown.find('input.dropdown-group-radio').on('click', function () {
				const offsets = jQuery(this).data('offset');
				const selected_index = $select.prop('selectedIndex');
				if (selected_index < offsets[0] - 1 || selected_index > offsets[1] - 1)
				{
					jQuery('#' + this.getAttribute('aria-controls')).collapse('show');
					$dropdown.find('input.dropdown-radio').prop('checked', false);
					$select.find('option:selected').data('selected', false).prop('selected', false);
					const opts = $select.find('option').slice(offsets[0] - 1, offsets[1]).not(':disabled');
					if (opts.length > 0)
					{
						opts.first().prop('selected', true);
					}
					else
					{
						$select.prop('selecteIndex', 0);
					}
					$select.trigger('change');
				}
			});
			$dropdown.find('input.dropdown-radio').on('change', function () {
				const offset = jQuery(this).data('offset');
				if (offset > 0)
				{
					const optgroup = jQuery(this).data('optgroup');
					if (optgroup > 0)
					{
						let checked = false;
						if (this.checked)
						{
							checked = (jQuery('#' + prefix + '-dropdown-collapse-' + optgroup).find('input.dropdown-checkbox:not(:checked)').length < 1);
							jQuery('#' + prefix + '-dropdown-optgroup-radio-' + optgroup).prop('checked', true);
						}
						jQuery('#' + prefix + '-dropdown-optgroup-checkbox-' + optgroup).prop('checked', checked);
					}
					else
					{
						$dropdown_menu.find('input.dropdown-group-radio:checked').prop('checked', false);
					}
					$select.find('option').eq(offset - 1).not(':disabled').data('selected', this.checked).prop('selected', this.checked);
					$select.trigger('change');
				}
			});
			submit_func = function () {
				const empty = ($select.val().length < 1);
				$dropdown_btn.toggleClass('border-danger', empty);
				if (empty)
				{
					return false;
				}
			};
		}
		if (this.required)
		{
			$select.parents('form').on('submit', submit_func).find('input[type="submit"], button[type="submit"]').on('click', submit_func);
		}
		if (select_options.enableCollapsibleOptGroups)
		{
			$dropdown.find('.collapse-toggle').on('click', function () {
				jQuery('#' + this.getAttribute('aria-controls')).collapse('toggle');
			});
		}
		if (select_options.enableFiltering)
		{
			const $searchResetBtn = jQuery('#' + prefix + '-search-reset').on('click', function () {
				document.getElementById(prefix + '-search-input').value = '';
				$dropdown_menu.find('.' + prefix + '-dropdown-toggle, .' + prefix + '-dropdown-item').removeClass('d-none');
				this.disabled = true;
			});
			jQuery('#' + prefix + '-search-input').on('keyup', function (e) {
				let search_text = this.value.replace(/^\s+|\s+$/g, '');
				if (!select_options.enableCaseSensitiveFiltering)
				{
					search_text = search_text.toLowerCase();
				}
				if (search_text.length > 0)
				{
					$dropdown_menu.find('.' + prefix + '-dropdown-item').each(function () {
						const $item = jQuery(this);
						const label_text = $item.text();
						$item.toggleClass('d-none', (select_options.enableCaseSensitiveFiltering
							? label_text.indexOf(search_text)
							: label_text.toLowerCase().indexOf(search_text)) < 0);
					});
					$dropdown_menu.find('.' + prefix + '-dropdown-toggle').each(function () {
						const $toggle = jQuery(this);
						$toggle.toggleClass('d-none', $toggle.find('.' + prefix + '-dropdown-item:not(.d-none)').length < 1);
					});
					$searchResetBtn.prop('disabled', false);
				}
				else
				{
					$dropdown_menu.find('.' + prefix + '-dropdown-toggle, .' + prefix + '-dropdown-item').removeClass('d-none');
					$searchResetBtn.prop('disabled', true);
				}
			}).prop('disabled', false);
		}
		jQuery('#' + prefix + '-reset-btn').on('click', function () {
			this.disabled = true;
			$select.multiselect('reset');
		});

		// Add handlers to disable inputs so they don't get submitted
		const $inputs = $dropdown.find('input:not(.disabled)');
		$dropdown.on('show.bs.dropdown', function () {
			$inputs.prop('disabled', false);
			max_height = ($dropdown.offset().top > 0)
				? Math.max(window.innerHeight - Math.ceil($dropdown.offset().top) - 48, (size > 1) ? ((size - 1) * 32) : 320) + 'px'
				: '20rem';
			$dropdown_menu.css({ 'max-height': max_height });
		}).on('hide.bs.dropdown', () => $inputs.prop('disabled', true));
		if ($dropdown.parents('.modal').length < 1)
		{
			// If drop down isn't in a modal, then detach menu and put in body
			$dropdown.on('shown.bs.dropdown', function () {
				if ($dropdown_menu.data('detached'))
				{
					return;
				}
				$body.append($dropdown_menu.data('detached', 1).css({
					'max-width': $dropdown_menu.width()
				}).detach());

				// Add MutationObserver to remove dropdown menu if dropdown goes away
				if (typeof MutationObserver == 'function')
				{
					const observer = new MutationObserver((mutationList, observer) => {
						if (!document.contains($select[0]))
						{
							observer.disconnect();
							$dropdown_menu.remove();
							$dropdown.remove();
						}
					});
					observer.observe(document, { childList: true, subtree:true });
				}
			});
		}

		// Set options under diabled optgroups to be disabled
		$select.find('optgroup[disabled] > option:not([disabled])').prop('disabled', true);

		// Add event handler so changes be propagated to dropdown
		$select.on('change', () => updateSelect($select));

		// Update select
		if (update)
		{
			updateSelect($select);
		}

		// Trigger change on page show so that drop down gets updated when back button gets pressed; and disable inputs so they don't submit values
		window.addEventListener('pageshow', (event) => {
			const navigation = window.performance.getEntriesByType('navigation');
			if (navigation.length > 0 && navigation[0].type == 'back_forward')
			{
				if ($select.find('option:selected').length > 0)
				{
					updateSelect($select);
				}
				$inputs.prop('disabled', true);
			}
		});
	});
};

/**
 * Default options for the current modal being displayed
 *
 * @type {object}
 * @todo add support for additional options
 */
jQuery.fn.multiselect.defaults = {
	collapseOptGroupsByDefault: false,
	dropDirection: 'down',
	enableCaseSensitiveFiltering: false,
	enableCollapsibleOptGroups: false,
	enableFiltering: false,
	includeSelectAllOption: false,
	includeSelectAllOptionMin: false, // Minimum number of options to automatically enable includeSelectAllOption
//	maxHeight: '20rem',
	selectAllDeselectAll: false,  // Deselect all if All is selected
	selectAllText: 'All',
	selectAllValue: ''
};

//-------------------------------------
}());
