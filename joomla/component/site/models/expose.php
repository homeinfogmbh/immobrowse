<?php
// No direct access to this file
defined('_JEXEC') or die('Restricted access');

// import Joomla modelitem library
jimport('joomla.application.component.modelitem');


class ImmoBrowseModelExpose extends JModelItem
{
    protected $customer;
    protected $sitekey;

    public function getTable($type = 'Config', $prefix = 'ImmoBrowseTable', $config = array())
    {
        return JTable::getInstance($type, $prefix, $config);
    }

    public function getCustomer($id = 1)
    {
        if (! is_array($this->customer))
        {
            $this->customer = array();
        }

        if (! isset($this->customer[$id]))
        {
            $jinput = JFactory::getApplication()->input;
            $id = $jinput->get('id', 1, 'INT' );
            $table = $this->getTable();
            $table->load($id);
            $this->customer[$id] = $table->id;
        }

        return $this->customer[$id];
    }

    public function getObjectId()
    {
        return JRequest::getVar('objectId');
    }

    public function getSitekey($id = 1)
    {
        if (! is_array($this->sitekey))
        {
            $this->sitekey = array();
        }

        if (! isset($this->sitekey[$id]))
        {
            $jinput = JFactory::getApplication()->input;
            $id = $jinput->get('id', 1, 'INT' );
            $table = $this->getTable();
            $table->load($id);
            $this->sitekey[$id] = $table->sitekey;
        }

        return $this->sitekey[$id];
    }
}
?>
