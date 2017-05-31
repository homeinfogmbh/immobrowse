<?php
// No direct access to this file
defined('_JEXEC') or die('Restricted access');

// import Joomla modelitem library
jimport('joomla.application.component.modelitem');

class ImmoBrowseModelList extends JModelItem
{
    protected $customer;

    public function getTable($type = 'Config', $prefix = 'ImmoBrowseTable', $config = array())
    {
        return JTable::getInstance($type, $prefix, $config);
    }

    public function getCustomer($cid)
    {
        if (! is_array($this->customer))
        {
            $this->customer = array();
        }

        if (! isset($this->customer[$cid]))
        {
            $jinput = JFactory::getApplication()->input;
            $cid = $jinput->get('customer', 1, 'INT' );
            $table = $this->getTable();
            $table->load($cid);
            $this->customer[$cid] = $table->customer;
        }

        return $this->customer[$cid];
    }
}
?>
