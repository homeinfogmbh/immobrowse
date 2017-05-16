<?php
// No direct access to this file
defined('_JEXEC') or die('Restricted access');

// import Joomla controller library
jimport('joomla.application.component.controller');

/**
 * General Controller of ImmoBrowse component
 */
class ImmoBrowseController extends JController
{
    /**
     * display task
     *
     * @return void
     */
    function display($cachable = false, $urlparams = false)
    {
        // set default view if not set
        $input = JFactory::getApplication()->input;
        $input->set('view', $input->getCmd('view', 'ImmoBrowse'));

        // call parent behavior
        parent::display($cachable);
    }
}
?>
