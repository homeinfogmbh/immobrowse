<?php
// No direct access to this file
defined('_JEXEC') or die('Restricted access');

// import Joomla controlleradmin library
jimport('joomla.application.component.controlleradmin');

/**
 * Customers Controller
 */
class ImmoBrowseControllerCustomers extends JControllerAdmin
{
    /**
     * Proxy for getModel.
     * @since    2.5
     */
    public function getModel($name = 'Customers', $prefix = 'ImmoBrowseModel')
    {
        $model = parent::getModel($name, $prefix, array('ignore_request' => true));
        return $model;
    }
}
?>
