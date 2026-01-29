<?php

namespace Awssat\Tailwindo\Framework;

class BootstrapFramework implements Framework
{
    protected $mediaOptions = [
        'xs'    => 'sm',
        'sm'    => 'sm',
        'md'    => 'md',
        'lg'    => 'lg',
        'xl'    => 'xl',
        'print' => 'print',
    ];

    protected $spacings = [
        '0'  => '0',
        '1'  => '1',
        '2'  => '2',
        '3'  => '4',
        '4'  => '6',
        '5'  => '12',
    ];

    protected $grid = [
        '1'  => '1/6',
        '2'  => '1/5',
        '3'  => '1/4',
        '4'  => '1/3',
        '5'  => '2/5',
        '6'  => '1/2',
        '7'  => '3/5',
        '8'  => '2/3',
        '9'  => '3/4',
        '10' => '4/5',
        '11' => '5/6',
        '12' => 'full',
    ];

    protected $colors = [
        'primary'   => 'blue-600',
        'secondary' => 'gray-600',
        'success'   => 'green-500',
        'danger'    => 'red-600',
        'warning'   => 'yellow-500',
        'info'      => 'teal-500',
        'light'     => 'gray-100',
        'dark'      => 'gray-900',
        'white'     => 'white',
        'muted'     => 'gray-700',
    ];

    public function frameworkName(): string
    {
        return 'Bootstrap';
    }

    public function supportedVersion(): array
    {
        /**
         * latest versions of Bootstrap/Tailwind during the coding of this file.
         */
        return [
            '4.4.1', // bootstrap
            '4.0.0', //tailwind
        ];
    }

    /**
     * This is the default css classes to be added to your main css file for compatibility.
     */
    public function defaultCSS(): array
    {
        return [
            //https://getbootstrap.com/docs/4.4/content/reboot/
            'h1' => '',
            //...
            'fieldset' => '',

            //https://getbootstrap.com/docs/4.4/content/typography/
            'del' => '',
            //..
            'a' => '',
            'p' => '',
        ];
    }

    /**
     * .get all convertible items.
     */
    public function get(): \Generator
    {
        foreach ([
            'general',
            'grid',
            'borders',
            'mediaObject',
            'colors',
            'display',
            'sizing',
            'flexElements',
            'spacing',
            'text',
            'floats',
            'positioning',
            'visibility',
            'alerts',
            'verticalAlignment',
            'badges',
            'breadcrumb',
            'buttons',
            'cards',
            'dropdowns',
            'forms',
            'inputGroups',
            'listGroups',
            'modals',
            'navs',
            'pagination',
        ] as $component) {
            yield $this->$component();
        }
    }

    protected function general(): array
    {
        $mainClasses = [
            'container-fluid' => 'w-full mx-auto sm:px-4',
            'container'       => function () {
                if ($this->isInLastSearches('jumbotron', 1)) {
                    return 'container mx-auto max-w-2xl sm:px-4';
                }

                return 'container mx-auto sm:px-4';
            },

            //http://getbootstrap.com/docs/4.0/utilities/embed/
            'embed-responsive'       => '',
            'embed-responsive-item'  => '',
            'embed-responsive-21by9' => '',
            'embed-responsive-16by9' => '',
            'embed-responsive-4by3'  => '',
            'embed-responsive-1by1'  => '',

            // http://getbootstrap.com/docs/4.0/utilities/image-replacement/
            'text-hide' => '',

            // http://getbootstrap.com/docs/4.0/utilities/screenreaders/
            'sr-only'           => 'sr-only',
            'sr-only-focusable' => 'focus:not-sr-only',

            // http://getbootstrap.com/docs/4.0/content/images/
            'img-fluid'     => 'max-w-full h-auto',
            'img-thumbnail' => 'max-w-full h-auto border border-gray-200 rounded p-1',

            //http://getbootstrap.com/docs/4.0/content/tables/
            'table'    => 'w-full max-w-full mb-4 bg-transparent',
            'table-sm' => 'p-1',
            // 'table-bordered' => '',
            // 'table-striped' => '',
            'table-responsive'                => 'block w-full overflow-auto scrolling-touch',
            'table-responsive-{regex_string}' => 'block w-full overflow-auto scrolling-touch',

            //http://getbootstrap.com/docs/4.0/content/figures/
            'figure'         => 'inline-block mb-4',
            'figure-img'     => 'mb-2 leading-none',
            'figure-caption' => 'text-gray-',

            'fade'     => 'opacity-0',
            'show'     => 'opacity-100 block', //need to be checked
            'disabled' => 'opacity-75',

            //http://getbootstrap.com/docs/4.0/components/collapse/
            // 'collapse' => 'hidden',
            'collapsing' => 'relative h-0 overflow-hidden ', //there should be a h-0

            //http://getbootstrap.com/docs/4.0/utilities/close-icon/
            'close' => 'absolute top-0 bottom-0 right-0 px-4 py-3',

            //http://getbootstrap.com/docs/4.0/components/jumbotron/
            'jumbotron'       => 'py-8 px-4 md:py-16 md:px-8 mb-8 bg-gray-200 rounded',
            'jumbotron-fluid' => 'pr-0 pl-0 rounded-none',
        ];

        $mainClassesEachScreen = [
            'container-{screen}'       => 'container min-w-{screen} mx-auto sm:px-4',
        ];

        $items = [];
        foreach ($mainClasses as $btClass => $twClass) {
            $items[$btClass] = $twClass;
        }

        foreach ($mainClassesEachScreen as $btClass => $twClass) {
            foreach ($this->mediaOptions as $btMedia => $twMedia) {
                $items[str_replace('{screen}', $btMedia, $btClass)] = str_replace('{screen}', $twMedia, $twClass);
            }
        }

        return $items;
    }

    protected function grid(): array
    {
        $items = [
            'row' => 'flex flex-wrap -mx-4',
            'col' => 'relative flex-grow max-w-full flex-1 px-4',
        ];

        //col-(xs|sm|md|lg|xl) = (sm|md|lg|xl):flex-grow
        //ml-(xs|sm|md|lg|xl)-auto = (sm|md|lg|xl):mx-auto:ml-auto
        //mr-(xs|sm|md|lg|xl)-auto = (sm|md|lg|xl):mx-auto:mr-auto
        foreach ($this->mediaOptions as $btMedia => $twMedia) {
            $items['col-'.$btMedia] = 'relative '.$twMedia.':flex-grow '.$twMedia.':flex-1 px-4';
            $items['ml-'.$btMedia.'-auto'] = $twMedia.':ml-auto';
            $items['mr-'.$btMedia.'-auto'] = $twMedia.':mr-auto';

            //col-btElem
            //col-(xs|sm|md|lg|xl)-btElem = (sm|md|lg|xl):w-twElem
            //offset-(xs|sm|md|lg|xl)-btElem = (sm|md|lg|xl):mx-auto
            foreach ($this->grid as $btElem => $twElem) {
                if ($btMedia === 'xs') {
                    $items['col-'.$btElem] = 'w-'.$twElem.' px-4';
                }

                $items['col-'.$btMedia.'-'.$btElem] = $twMedia.':w-'.$twElem.' px-4';

                //might work :)
                $items['offset-'.$btMedia.'-'.$btElem] = $twMedia.':mx-'.$twElem;
            }
        }

        return $items;
    }

    protected function mediaObject(): array
    {
        //http://getbootstrap.com/docs/4.0/layout/media-object/
        return [
            'media'      => 'flex items-start',
            'media-body' => 'flex-1',
        ];
    }

    protected function borders(): array
    {
        $items = [];

        foreach ([
            'top' => 't',
            'right' => 'r',
            'bottom' => 'b',
            'left' => 'l',
        ] as $btSide => $twSide) {
            $items['border-'.$btSide] = 'border-'.$twSide;
            $items['border-'.$btSide.'-0'] = 'border-'.$twSide.'-0';
        }

        foreach ($this->colors as $btColor => $twColor) {
            $items['border-'.$btColor] = 'border-'.$twColor;
        }

        foreach ([
            'top' => 't',
            'right' => 'r',
            'bottom' => 'b',
            'left' => 'l',
            'circle' => 'full',
            'pill' => 'full py-2 px-4',
            '0' => 'none',
        ] as $btStyle => $twStyle) {
            $items['rounded-'.$btStyle] = 'rounded-'.$twStyle;
        }

        return $items;
    }

    protected function colors(): array
    {
        $items = [];

        foreach ($this->colors as $btColor => $twColor) {
            $items['text-'.$btColor] = 'text-'.$twColor;
            $items['bg-'.$btColor] = 'bg-'.$twColor;
            $items['table-'.$btColor] = 'bg-'.$twColor;
            // $items['bg-gradient-'.$btColor] = 'bg-'.$twColor;
        }

        return $items;
    }

    protected function display(): array
    {
        //.d-none
        //.d-{sm,md,lg,xl}-none
        $items = [];

        foreach ([
            'none' => 'hidden',
            'inline' => 'inline',
            'inline-block' => 'inline-block',
            'block' => 'block',
            'table' => 'table',
            'table-cell' => 'table-cell',
            'table-row' => 'table-row',
            'flex' => 'flex',
            'inline-flex' => 'inline-flex',
        ] as $btElem => $twElem) {
            $items['d-'.$btElem] = $twElem;

            foreach ($this->mediaOptions as $btMedia => $twMedia) {
                $items['d-'.$btMedia.'-'.$btElem] = $twMedia.':'.$twElem;
            }
        }

        return $items;
    }

    protected function flexElements(): array
    {
        $items = [];

        foreach (array_merge($this->mediaOptions, [''=>'']) as $btMedia => $twMedia) {
            foreach (['row', 'row-reverse', 'column', 'column-reverse'] as $key) {
                $items['flex'.(empty($btMedia) ? '' : '-').$btMedia.'-'.$key] = (empty($twMedia) ? '' : $twMedia.':').'flex-'.str_replace('column', 'col', $key);
            }

            foreach (['start', 'end', 'center', 'between', 'around'] as $key) {
                $items['justify-content'.(empty($btMedia) ? '' : '-').$btMedia.'-'.$key] = (empty($twMedia) ? '' : $twMedia.':').'justify-'.$key;
            }

            foreach (['start', 'end', 'center', 'stretch', 'baseline'] as $key) {
                $items['align-items'.(empty($btMedia) ? '' : '-').$btMedia.'-'.$key] = (empty($twMedia) ? '' : $twMedia.':').'items-'.$key;
            }

            foreach (['start', 'end', 'center', 'stretch', 'baseline'] as $key) {
                $items['align-content'.(empty($btMedia) ? '' : '-').$btMedia.'-'.$key] = (empty($twMedia) ? '' : $twMedia.':').'content-'.$key;
            }

            foreach (['start', 'end', 'center', 'stretch', 'baseline'] as $key) {
                $items['align-self'.(empty($btMedia) ? '' : '-').$btMedia.'-'.$key] = (empty($twMedia) ? '' : $twMedia.':').'self-'.$key;
            }

            $items['flex'.(empty($btMedia) ? '' : '-').$btMedia.'-wrap'] = (empty($twMedia) ? '' : $twMedia.':').'flex-wrap';
            $items['flex'.(empty($btMedia) ? '' : '-').$btMedia.'-wrap-reverse'] = (empty($twMedia) ? '' : $twMedia.':').'flex-wrap-reverse';
            $items['flex'.(empty($btMedia) ? '' : '-').$btMedia.'-nowrap'] = (empty($twMedia) ? '' : $twMedia.':').'flex-nowrap';

            $items['flex'.(empty($btMedia) ? '' : '-').$btMedia.'-nowrap'] = (empty($twMedia) ? '' : $twMedia.':').'flex-nowrap';

            if ($btMedia != '') {
                $items['order-'.$btMedia.'-{regex_number}'] = $twMedia.':order-{regex_number}';
            }
        }

        return $items;
    }

    protected function sizing(): array
    {
        $items = [];

        foreach ([
            '25' => '1/4',
            '50' => '1/2',
            '75' => '3/4',
            '100' => 'full',
        ] as $btClass => $twClass) {
            $items['w-'.$btClass] = 'w-'.$twClass;

            //no percentages in TW for heights except for full
            if ($btClass == 100) {
                $items['h-'.$btClass] = 'h-'.$twClass;
            }
        }

        $items['mw-100'] = 'max-w-full';
        $items['mh-100'] = 'max-h-full';

        return $items;
    }

    protected function spacing(): array
    {
        $items = [];
        $spacingProperties = ['p', 'm'];

        foreach ($spacingProperties as $property) {
            foreach ($this->spacings as $btSpacing => $twSpacing) {
                $items[$property.'-'.$btSpacing] = $property.'-'.$twSpacing;
            }
        }

        foreach ($spacingProperties as $property) {
            foreach ($this->mediaOptions as $btMedia => $twMedia) {
                foreach ($this->spacings as $btSpacing => $twSpacing) {
                    $items[$property.'-'.$btMedia.'-'.$btSpacing] = $twMedia.':'.$property.'-'.$twSpacing;
                    $items[$property.'{regex_string}-'.$btMedia.'-'.$btSpacing] = $twMedia.':'.$property.'{regex_string}-'.$twSpacing;
                }

                $items[$property.'{regex_string}-'.$btMedia.'-auto'] = $twMedia.':'.$property.'{regex_string}-auto';
            }
        }

        return $items;
    }

    protected function text(): array
    {
        $items = [
            'text-nowrap'   => 'whitespace-nowrap',
            'text-truncate' => 'truncate',

            'text-lowercase'  => 'lowercase',
            'text-uppercase'  => 'uppercase',
            'text-capitalize' => 'capitalize',

            'initialism' => '',
            'lead'       => 'text-xl font-light',
            'small'      => 'text-xs',
            'mark'       => '',
            'display-1'  => 'text-xl',
            'display-2'  => 'text-2xl',
            'display-3'  => 'text-3xl',
            'display-4'  => 'text-4xl',

            'h-1' => 'mb-2 font-medium leading-tight text-4xl',
            'h-2' => 'mb-2 font-medium leading-tight text-3xl',
            'h-3' => 'mb-2 font-medium leading-tight text-2xl',
            'h-4' => 'mb-2 font-medium leading-tight text-xl',
            'h-5' => 'mb-2 font-medium leading-tight text-lg',
            'h-6' => 'mb-2 font-medium leading-tight text-base',

            'blockquote'        => 'mb-6 text-lg',
            'blockquote-footer' => 'block text-gray-',

            'font-weight-bold'   => 'font-bold',
            'font-weight-normal' => 'font-normal',
            'font-weight-300'    => 'font-light',
            'font-italic'        => 'italic',
        ];

        foreach (['left', 'right', 'center', 'justify'] as $alignment) {
            foreach (array_merge($this->mediaOptions, [''=>'']) as $btMedia => $twMedia) {
                $items['text'.(empty($btMedia) ? '' : '-'.$btMedia).'-'.$alignment] = (empty($twMedia) ? '' : $twMedia.':').'text-'.$alignment;
            }
        }

        return $items;
    }

    protected function floats(): array
    {
        $items = [];

        foreach ($this->mediaOptions as $btMedia => $twMedia) {
            foreach (['left', 'right', 'none'] as $alignment) {
                $items['float-'.$btMedia.'-'.$alignment] = $twMedia.':float-'.$alignment;
            }
        }

        return $items;
    }

    protected function positioning(): array
    {
        $items = [];

        foreach ([
            'position-static' => 'static',
            'position-relative' => 'relative',
            'position-absolute' => 'absolute',
            'position-fixed' => 'fixed',
            'position-sticky' => '',
            'fixed-top' => 'top-0',
            'fixed-bottom' => 'bottom-0',
        ] as $btPosition => $twPosition) {
            $items[$btPosition] = $twPosition;
        }

        return $items;
    }

    protected function verticalAlignment(): array
    {
        //same
        $items = [];
        // foreach ([
        //     'baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom'
        // ] as $btAlign=> $twAlign) {
        //     $items['align-'.$btAlign] = 'align-'.$twAlign;
        // }
        return $items;
    }

    protected function visibility(): array
    {
        //same
        return [];
    }

    protected function alerts()
    {
        $items = [
            'alert'             => 'relative px-4 py-3 mb-4 border rounded',
            'alert-heading'     => '', //color: inherit
            'alert-link'        => 'font-bold no-underline text-current',
            'alert-dismissible' => '',
        ];

        $colors = [
            'primary'   => 'bg-blue-100 border-blue-400 text-blue-700',
            'secondary' => 'bg-gray-100 border-gray-400 text-gray-700',
            'success'   => 'bg-green-100 border-green-400 text-green-700',
            'danger'    => 'bg-red-100 border-red-400 text-red-700',
            'warning'   => 'bg-orange-100 border-orange-400 text-orange-700',
            'info'      => 'bg-teal-100 border-teal-400 text-teal-700',
            'light'     => 'bg-white text-gray-600',
            'dark'      => 'bg-gray-200 border-gray-500 text-gray-900',
        ];

        foreach ($colors as $btColor => $twColor) {
            $items['alert-'.$btColor] = $twColor;
        }

        return $items;
    }

    protected function badges(): array
    {
        $items = [
            'badge'      => 'inline-block p-1 text-center font-semibold text-sm align-baseline leading-none rounded',
            'badge-pill' => 'rounded-full py-1 px-3',
        ];

        $colors = [
            'primary'   => 'bg-blue-500 text-white hover:bg-blue-600',
            'secondary' => 'bg-gray-600 text-white hover:bg-gray-700',
            'success'   => 'bg-green-500 text-white hover:green-600',
            'danger'    => 'bg-red-600 text-white hover:bg-red-700',
            'warning'   => 'bg-orange-400 text-black hover:bg-orange-500',
            'info'      => 'bg-teal-500 text-white hover:bg-teal-600',
            'light'     => 'bg-gray-100 text-gray-800 hover:bg-gray-200',
            'dark'      => 'bg-gray-900 text-white',
        ];

        foreach ($colors as $btColor => $twColor) {
            $items['badge-'.$btColor] = $twColor;
        }

        return $items;
    }

    protected function breadcrumb(): array
    {
        return [
            'breadcrumb'     => 'flex flex-wrap list-reset pt-3 pb-3 py-4 px-4 mb-4 bg-gray-200 rounded',
            'breadcrumb-item'=> 'inline-block px-2 py-2 text-gray-700',
        ];
    }

    protected function buttons(): array
    {
        $items = [
            'btn'                => 'inline-block align-middle text-center select-none border font-normal whitespace-nowrap rounded {tailwindo|py-2 px-4 leading-normal} no-underline',
            'btn-group'          => 'relative inline-flex align-middle',
            'btn-group-vertical' => 'relative inline-flex align-middle flex-col items-start justify-center',
            'btn-toolbar'        => 'flex flex-wrap justify-start',
            'btn-link'           => 'font-normal text-blue-700 bg-transparent',
            'btn-block'          => 'w-full block',
        ];

        foreach ([
            'sm' => '{tailwindo|py-1 px-2 leading-tight} text-xs ',
            'lg' => '{tailwindo|py-3 px-4 leading-tight} text-xl',
        ] as $btMedia => $twClasses) {
            $items['btn-'.$btMedia] = $twClasses;
            $items['btn-group-'.$btMedia] = $twClasses;
        }

        // Color map: name => [main_color, text_color, hover_shade, ring_color]
        $colorMap = [
            'primary'   => ['blue-600', 'white', 'blue-700', 'blue-300'],
            'secondary' => ['gray-600', 'white', 'gray-700', 'gray-300'],
            'success'   => ['green-500', 'white', 'green-600', 'green-300'],
            'danger'    => ['red-600', 'white', 'red-700', 'red-300'],
            'warning'   => ['orange-400', 'black', 'orange-500', 'orange-200'],
            'info'      => ['teal-500', 'white', 'teal-600', 'teal-300'],
            'light'     => ['gray-100', 'gray-800', 'gray-200', 'gray-400'],
            'dark'      => ['gray-900', 'white', 'gray-800', 'gray-500'],
        ];

        foreach ($colorMap as $name => $props) {
            $bg = $props[0];
            $text = $props[1];
            $hover = $props[2];
            $ring = $props[3];

            // Solid button
            $items['btn-'.$name] = "bg-{$bg} text-{$text} hover:bg-{$hover} focus:ring-4 focus:ring-{$ring}";

            // Outline button
            if ($name === 'light') {
                // Light outline is special.
                 $items['btn-outline-'.$name] = "bg-transparent text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-800";
            } elseif ($name === 'warning') {
                 $items['btn-outline-'.$name] = "bg-transparent text-orange-400 border border-orange-400 hover:bg-orange-400 hover:text-black";
            } else {
                 $items['btn-outline-'.$name] = "bg-transparent text-{$bg} border border-{$bg} hover:bg-{$bg} hover:text-{$text}";
            }
        }

        return $items;
    }

    protected function cards(): array
    {
        return [
            'card-deck'  => 'flex flex-row flex-wrap md:flex-nowrap -mx-1',
            'card-group' => 'flex flex-col',
            'card'       => function () {
                if ($this->isInLastSearches('card-deck')) {
                    return 'relative block md:flex w-full md:min-w-0 md:mx-4 flex-col flex-shrink-0 flex-grow rounded-lg break-words border bg-white border-gray-200 shadow-sm';
                } else {
                    return 'relative flex flex-col min-w-0 rounded-lg break-words border bg-white border-gray-200 shadow-sm';
                }
            },
            'card-body'         => 'flex-auto p-5',
            'card-title'        => 'mb-3',
            'card-text'         => 'mb-0',
            'card-subtitle'     => '-mt-2 mb-0',
            'card-link'         => 'ml-6',
            'card-header'       => 'py-3 px-6 mb-0 bg-gray-200 border-b border-gray-300 text-gray-900',
            'card-footer'       => 'py-3 px-6 bg-gray-200 border-t border-gray-300',
            'card-header-tabs'  => 'border-b-0 -ml-2 -mb-3',
            'card-header-pills' => '-ml-3 -mr-3',
            'card-img-overlay'  => 'absolute inset-y-0 inset-x-0 p-6',
            'card-img'          => 'w-full rounded',
            'card-img-top'      => 'w-full rounded rounded-t',
            'card-img-bottom'   => 'w-full rounded rounded-b',
        ];
    }

    protected function dropdowns(): array
    {
        return [
            'dropdown'         => 'relative',
            'dropup'           => 'relative',
            'dropdown-toggle'  => ' inline-block w-0 h-0 ml-1 align border-b-0 border-t border-r border-l',
            'dropdown-menu'    => ' absolute left-0 z-50 float-left hidden list-reset	 py-2 mt-1 text-base bg-white border border-gray-300 rounded',
            'dropdown-divider' => 'h-0 my-2 overflow-hidden border-t border-gray-300',
            'dropdown-item'    => 'block w-full py-1 px-6 font-normal text-gray-900 whitespace-nowrap border-0',
            'dropdown-header'  => 'block py-2 px-6 mb-0 text-sm text-gray-800 whitespace-nowrap',
        ];
    }

    protected function forms(): array
    {
        return [
            'form-group'         => 'mb-4',
            'form-control'       => 'block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none',
            'form-control-lg'    => 'py-2 px-4 text-lg leading-normal rounded',
            'form-control-sm'    => 'py-1 px-2 text-sm leading-normal rounded',
            'form-control-file'  => 'block appearance-none',
            'form-control-range' => 'block appearance-none',

            'form-inline' => 'flex items-center',

            'col-form-label'    => 'pt-2 pb-2 mb-0 leading-normal',
            'col-form-label-lg' => 'pt-3 pb-3 mb-0 leading-normal',
            'col-form-label-sm' => 'pt-1 pb-1 mb-0 leading-normal',

            'col-form-legend'    => 'pt-2 pb-2 mb-0 text-base',
            'col-form-plaintext' => 'pt-2 pb-2 mb-0 leading-normal bg-transparent border-transparent border-r-0 border-l-0 border-t border-b',

            'form-text'        => 'block mt-1',
            'form-row'         => 'flex flex-wrap -mr-1 -ml-1',
            'form-check'       => 'relative block mb-2',
            'form-check-label' => 'text-gray-700 pl-6 mb-0',
            'form-check-input' => 'absolute mt-1 -ml-6',

            'form-check-inline' => 'inline-block mr-2',
            'valid-feedback'    => 'hidden mt-1 text-sm text-green',
            'valid-tooltip'     => 'absolute z-10 hidden w-4 font-normal leading-normal text-white rounded p-2 bg-green-700',
            'is-valid'          => 'bg-green-700',
            'invalid-feedback'  => 'hidden mt-1 text-sm text-red',
            'invalid-tooltip'   => 'absolute z-10 hidden w-4 font-normal leading-normal text-white rounded p-2 bg-red-700',
            'is-invalid'        => 'bg-red-700',
        ];
    }

    protected function inputGroups(): array
    {
        return [
            'input-group'          => 'relative flex items-stretch w-full',
            'input-group-addon'    => 'py-1 px-2 mb-1 text-base font-normal leading-normal text-gray-900 text-center bg-gray-300 border border-4 border-gray-100 rounded',
            'input-group-addon-lg' => 'py-2 px-3 mb-0 text-lg',
            'input-group-addon-sm' => 'py-3 px-4 mb-0 text-lg',
        ];
    }

    protected function listGroups(): array
    {
        $items = [
            'list-group'             => 'flex flex-col pl-0 mb-0 border rounded border-gray-300',
            'list-group-item-action' => 'w-fill',
            'list-group-item'        => 'relative block py-3 px-6 -mb-px border border-r-0 border-l-0 border-gray-300 no-underline',
            'list-group-flush'       => '',
        ];

        //TODO
        foreach ($this->colors as $btColor => $twColor) {
            if ($btColor === 'dark') {
                $items['list-group-item-'.$btColor] = 'text-white bg-gray-700';
            } elseif ($btColor == 'light') {
                $items['list-group-item-'.$btColor] = 'text-black bg-gray-200';
            } else {
                $items['list-group-item-'.$btColor] = 'bg-'.$twColor.'-200 text-'.$twColor.'-900';
            }
        }

        return $items;
    }

    protected function modals(): array
    {
        //TODO
        return [];
    }

    protected function navs(): array
    {
        $items = [
            'nav'           => 'flex flex-wrap list-none pl-0 mb-0',
            'nav-tabs'      => 'border border-t-0 border-r-0 border-l-0 border-b-1 border-gray-200',
            'nav-pills'     => '',
            'nav-fill'      => '',
            'nav-justified' => '',
        ];

        $items['nav-link'] = function () {
            $navLinkClasses = 'inline-block py-2 px-4 no-underline';
            if ($this->isInLastSearches('nav-tabs', 5)) {
                $navLinkClasses .= ' border border-b-0 mx-1 rounded rounded-t';
            } elseif ($this->isInLastSearches('nav-pills', 5)) {
                $navLinkClasses .= ' border border-blue bg-blue rounded text-white mx-1';
            }

            return $navLinkClasses;
        };

        $items['nav-item'] = function () {
            $navItemClasses = '';

            if ($this->isInLastSearches('nav-tabs', 5)) {
                $navItemClasses .= '-mb-px';
            } elseif ($this->isInLastSearches('nav-fill', 5)) {
                $navItemClasses .= ' flex-auto text-center';
            } elseif ($this->isInLastSearches('nav-justified', 5)) {
                $navItemClasses .= ' flex-grow text-center';
            }

            return $navItemClasses;
        };

        $items['navbar'] = 'relative flex flex-wrap items-center content-between py-3 px-4';
        $items['navbar-brand'] = 'inline-block pt-1 pb-1 mr-4 text-lg whitespace-nowrap';
        $items['navbar-nav'] = 'flex flex-wrap list-reset pl-0 mb-0';
        $items['navbar-text'] = 'inline-block pt-2 pb-2';
        $items['navbar-dark'] = 'text-white';
        $items['navbar-light'] = 'text-black';
        $items['navbar-collapse'] = 'flex-grow items-center';
        $items['navbar-expand'] = 'flex-nowrap content-start';
        $items['navbar-expand-{regex_string}'] = '';
        $items['navbar-toggler'] = 'py-1 px-2 text-md leading-normal bg-transparent border border-transparent rounded';

        //for now
        $items['collapse'] = 'hidden';
        $items['navbar-toggler-icon'] = 'px-5 py-1 border border-gray-600 rounded';

        return $items;
    }

    protected function pagination(): array
    {
        return [
            'pagination'    => 'flex list-reset pl-0 rounded',
            'pagination-lg' => 'text-xl',
            'pagination-sm' => 'text-sm',
            'page-link'     => 'relative block py-2 px-3 -ml-px leading-normal text-blue bg-white border border-gray-200 no-underline hover:text-blue-800 hover:bg-gray-200',
            // 'page-link' => 'relative block py-2 px-3 -ml-px leading-normal text-blue bg-white border border-gray-',
        ];
    }
}
