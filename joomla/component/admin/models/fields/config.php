<?php
// No direct access to this file
defined('_JEXEC') or die;

// import the list field type
jimport('joomla.form.helper');
JFormHelper::loadFieldClass('list');

class JFormFieldConfig extends JFormFieldList
{
    protected $type = 'Config';

    protected function getOptions()
    {
        $db = JFactory::getDBO();
        $query = $db->getQuery(true);
        $query->select('customer');
        $query->from('#__immobrowse');
        $db->setQuery((string)$query);
        $messages = $db->loadObjectList();
        $options = array();

        if ($messages)
        {
            foreach($messages as $message)
            {
                $options[] = JHtml::_('select.option', $message->customer, $message->customer);
            }
        }

        $options = array_merge(parent::getOptions(), $options);
        return $options;
    }
}
?>
